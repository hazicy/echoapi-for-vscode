const fs = require('node:fs/promises');
const path = require('node:path');
const esbuild = require('esbuild');
const assert = require('node:assert/strict');

async function main() {
  const output = path.resolve(__dirname, '../dist');
  assert.ok((await fs.stat(path.join(output, 'webviews.css'))).size > 0,
    'Webview HTML requires the extracted stylesheet.');
  for (const filename of ['tree-sitter.wasm', 'tree-sitter-bash.wasm', 'fonts/iconfont.js']) {
    await fs.access(path.join(output, filename));
  }
  const entries = (await fs.readdir(output)).filter(name => /Panel(?:\.bundle)?\.js$/.test(name));
  const chunks = (await fs.readdir(path.join(output, 'chunks')))
    .filter(name => name.endsWith('.js')).map(name => `chunks/${name}`);
  if (entries.length !== 9 || chunks.length === 0) {
    throw new Error('Expected nine Webview entries and shared ESM chunks.');
  }
  // Parse emitted modules independently: injected globals and vendor-local
  // bindings can collide only after code splitting, even if bundling succeeds.
  for (const filename of [...entries, ...chunks]) {
    await esbuild.transform(await fs.readFile(path.join(output, filename), 'utf8'), {
      loader: 'js', format: 'esm', sourcefile: filename, logLevel: 'silent',
    });
  }
  console.log(`Parsed ${entries.length} Webview entries and ${chunks.length} shared/lazy chunks.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
