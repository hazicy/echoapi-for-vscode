const esbuild = require('esbuild');
const fs = require('node:fs/promises');
const path = require('node:path');
const { nodeModulesPolyfillPlugin } = require('esbuild-plugins-node-modules-polyfill');
const { transform } = require('@svgr/core');

const root = path.resolve(__dirname, '..');
const production = process.argv.includes('--production');
const serve = process.argv.includes('--serve');
const watch = serve || process.argv.includes('--watch');
const panels = ['sidePanel', 'tagPanel', 'environmentPanel', 'loginPanel', 'pushPanel',
  'importDataPanel', 'folderTestPanel', 'folderTestReportPanel', 'shareListPanel', 'exportDataPanel'];
const renameClasses = source => source.replace(/\.apipost-/g, '.beautify-');
const assets = { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.gif': 'dataurl',
  '.ico': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl', '.ttf': 'dataurl', '.txt': 'text' };

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
    mainFields: ['module', 'main'],
  };
  const webviews = {
    ...common, entryPoints: Object.fromEntries(panels.map(name => [name, `src/webviews/${name}.tsx`])),
    outdir: 'dist', entryNames: serve ? '[name].bundle' : '[name]',
    platform: 'browser', format: 'iife', target: 'es2020', loader: assets,
    mainFields: ['browser', 'module', 'main'],
    plugins: [webviewAssets, nodeModulesPolyfillPlugin({
      globals: { Buffer: true, process: true },
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
        .replace('</body>', '<script src="/sidePanel.bundle.js"></script></body>');
      await fs.writeFile(path.join(root, 'dist/sidePanel.html'), html);
      await contexts[1].serve({ servedir: path.join(root, 'dist'), port: 8080, cors: { origin: '*' } });
    }
    const stop = async () => { await Promise.all(contexts.map(context => context.dispose())); process.exit(0); };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  } else {
    await Promise.all([esbuild.build(extension), esbuild.build(webviews)]);
    console.log(`Build completed in ${((performance.now() - started) / 1000).toFixed(2)}s`);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
