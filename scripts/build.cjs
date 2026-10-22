const esbuild = require('esbuild');
const fs = require('node:fs/promises');
const path = require('node:path');
const { nodeModulesPolyfillPlugin } = require('esbuild-plugins-node-modules-polyfill');
const { transform } = require('@svgr/core');

const root = path.resolve(__dirname, '..');
const production = process.argv.includes('--production');
const serve = process.argv.includes('--serve');
const watch = serve || process.argv.includes('--watch');
const analyze = process.argv.includes('--analyze');
const panels = ['sidePanel', 'tagPanel', 'environmentPanel', 'pushPanel',
  'importDataPanel', 'folderTestPanel', 'folderTestReportPanel', 'shareListPanel', 'exportDataPanel'];
const renameClasses = source => source.replace(/\.apipost-/g, '.beautify-');
const assets = { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.gif': 'dataurl',
  '.ico': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl', '.ttf': 'dataurl', '.txt': 'text' };

const jsoncEsm = {
  name: 'jsonc-parser-esm',
  setup(build) {
    // Its UMD wrapper hides require calls from esbuild. Prefer ESM only for
    // this package; other Node dependencies must retain their CommonJS entry.
    build.onResolve({ filter: /^jsonc-parser$/ }, async args => {
      const manifest = require.resolve('jsonc-parser/package.json', { paths: [args.resolveDir] });
      const metadata = JSON.parse(await fs.readFile(manifest, 'utf8'));
      return { path: path.resolve(path.dirname(manifest), metadata.module) };
    });
  },
};

const webviewAssets = {
  name: 'webview-assets',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, async ({ path: filename }) => ({
      contents: await transform(await fs.readFile(filename, 'utf8'), {
        plugins: ['@svgr/plugin-jsx'], jsxRuntime: 'automatic',
      }, { filePath: filename }),
      loader: 'jsx', resolveDir: path.dirname(filename),
    }));
    // The panel HTML only loads JavaScript, so keep styles inside each bundle.
    build.onLoad({ filter: /\.(css|less)$/ }, async ({ path: filename }) => {
      let source = await fs.readFile(filename, 'utf8');
      const local = !filename.includes(`${path.sep}node_modules${path.sep}`);
      if (local) { source = renameClasses(source); }
      let imports = [];
      if (filename.endsWith('.less')) {
        const rendered = await require('less').render(source, { filename });
        source = rendered.css;
        imports = rendered.imports;
      }
      const result = await esbuild.build({
        stdin: { contents: source, loader: 'css', resolveDir: path.dirname(filename), sourcefile: filename },
        bundle: true, write: false, metafile: true, minify: production,
        loader: { ...assets, '.svg': 'dataurl' }, logLevel: 'silent',
        plugins: [{ name: 'public-css-urls', setup(cssBuild) {
          cssBuild.onResolve({ filter: /^\// }, args => {
            if (args.kind === 'url-token') { return { path: args.path, external: true }; }
          });
        } }],
      });
      const css = result.outputFiles[0].text;
      return {
        contents: `const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style);`,
        loader: 'js', resolveDir: path.dirname(filename),
        watchFiles: [filename, ...imports, ...Object.keys(result.metafile.inputs).filter(p => !p.startsWith('<')).map(p => path.resolve(root, p))],
      };
    });
    build.onLoad({ filter: /(?:style|globalStyle)\.ts$/ }, async ({ path: filename }) => {
      if (filename.includes(`${path.sep}node_modules${path.sep}`)) { return; }
      return { contents: renameClasses(await fs.readFile(filename, 'utf8')), loader: 'ts', resolveDir: path.dirname(filename) };
    });
  },
};

async function main() {
  const started = performance.now();
  // dist is generated output; remove stale development bundles before packaging.
  await fs.rm(path.join(root, 'dist'), { recursive: true, force: true });
  await fs.mkdir(path.join(root, 'dist'), { recursive: true });
  await fs.cp(path.join(root, 'public'), path.join(root, 'dist'), { recursive: true });
  for (const file of ['tree-sitter.wasm', 'tree-sitter-bash.wasm']) {
    await fs.copyFile(path.join(root, 'node_modules/web-curl-to-har/assets', file), path.join(root, 'dist', file));
  }
  const common = {
    absWorkingDir: root, bundle: true, minify: production, sourcemap: production ? false : 'linked',
    sourcesContent: false, logLevel: 'info', jsx: 'automatic',
    alias: { '@': path.join(root, 'src') },
    define: { 'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development') },
    drop: production ? ['console', 'debugger'] : [], legalComments: 'none',
  };
  const extension = {
    ...common, entryPoints: ['src/extension.ts'], outfile: 'dist/extension.js',
    platform: 'node', format: 'cjs', target: 'node16', external: ['vscode'],
    mainFields: ['main', 'module'], plugins: [jsoncEsm],
  };
  const webviews = {
    ...common, entryPoints: Object.fromEntries(panels.map(name => [name, `src/webviews/${name}.tsx`])),
    metafile: analyze,
    outdir: 'dist', entryNames: serve ? '[name].bundle' : '[name]',
    platform: 'browser', format: 'esm', splitting: true,
    chunkNames: 'chunks/[name]-[hash]', assetNames: 'assets/[name]-[hash]',
    target: 'es2020', loader: assets,
    mainFields: ['browser', 'module', 'main'],
    define: { ...common.define, process: '__echoApiProcess', Buffer: '__echoApiBuffer' },
    inject: [path.join(root, 'scripts/browser-globals.mjs')],
    plugins: [webviewAssets, nodeModulesPolyfillPlugin({
      modules: {
        ...Object.fromEntries(['assert', 'buffer', 'console', 'constants', 'crypto', 'domain',
          'events', 'http', 'https', 'os', 'punycode', 'process', 'querystring', 'stream',
          '_stream_duplex', '_stream_passthrough', '_stream_readable', '_stream_transform',
          '_stream_writable', 'string_decoder', 'sys', 'timers', 'tty', 'url', 'util', 'vm', 'zlib']
          .map(name => [name, true])),
        fs: 'empty', child_process: 'empty', path: 'empty',
      },
    })],
  };
  if (watch) {
    const contexts = await Promise.all([esbuild.context(extension), esbuild.context(webviews)]);
    await Promise.all(contexts.map(context => context.watch()));
    if (serve) {
      const html = (await fs.readFile(path.join(root, 'src/index.html'), 'utf8'))
        .replace('</body>', '<script type="module" src="/sidePanel.bundle.js"></script></body>');
      await fs.writeFile(path.join(root, 'dist/sidePanel.html'), html);
      await contexts[1].serve({ servedir: path.join(root, 'dist'), port: 8080, cors: { origin: '*' } });
    }
    const stop = async () => { await Promise.all(contexts.map(context => context.dispose())); process.exit(0); };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  } else {
    const [, webviewResult] = await Promise.all([esbuild.build(extension), esbuild.build(webviews)]);
    if (analyze) {
      const outputs = webviewResult.metafile.outputs;
      const total = Object.values(outputs).reduce((sum, output) => sum + output.bytes, 0);
      console.log(`\nAll Webview entries and chunks: ${(total / 1024 / 1024).toFixed(2)} MiB`);
      for (const [filename, output] of Object.entries(outputs)) {
        if (!output.entryPoint?.startsWith('src/webviews/')) { continue; }
        const visited = new Set();
        const packages = new Map();
        const visit = name => {
          if (visited.has(name) || !outputs[name]) { return; }
          visited.add(name);
          for (const [input, info] of Object.entries(outputs[name].inputs)) {
            const match = input.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
            const pkg = match ? match[1] : 'Application code and styles';
            packages.set(pkg, (packages.get(pkg) || 0) + info.bytesInOutput);
          }
          for (const dependency of outputs[name].imports) {
            if (!dependency.external && dependency.kind !== 'dynamic-import') { visit(dependency.path); }
          }
        };
        visit(filename);
        const initialBytes = [...visited].reduce((sum, name) => sum + outputs[name].bytes, 0);
        console.log(`\n${filename}: entry ${(output.bytes / 1024).toFixed(1)} KiB, initial graph ${(initialBytes / 1024 / 1024).toFixed(2)} MiB`);
        const queue = [[output.entryPoint]];
        const seenInputs = new Set();
        while (queue.length) {
          const chain = queue.shift();
          const input = chain[chain.length - 1];
          if (seenInputs.has(input)) { continue; }
          seenInputs.add(input);
          if (/node_modules\/mockjs5-pro\//.test(input)) {
            console.log(`  Static Mock dependency: ${chain.join(' -> ')}`);
            break;
          }
          for (const dependency of webviewResult.metafile.inputs[input]?.imports || []) {
            if (!dependency.external && dependency.kind !== 'dynamic-import') { queue.push([...chain, dependency.path]); }
          }
        }
        for (const [name, bytes] of [...packages].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
          console.log(`  ${(bytes / 1024 / 1024).toFixed(2)} MiB  ${name}`);
        }
      }
    }
    console.log(`Build completed in ${((performance.now() - started) / 1000).toFixed(2)}s`);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
