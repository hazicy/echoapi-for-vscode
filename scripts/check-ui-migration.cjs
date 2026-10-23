const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const forbidden = /(?:from\s*|import\s*\(?\s*|require\(\s*)['"](?:antd(?:\/[^'"]*)?|styled-components|@ant-design\/[^'"]*)['"]/;
const failures = [];
const slots = new Set([...fs.readFileSync(path.join(root, 'src/components/ui/base/slots.module.css'), 'utf8').matchAll(/^\.([\w-]+)\s*\{/gm)].map(match => match[1]));
let modules = 0;
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(filename);
    else if (filename.endsWith('.css')) {
      if (filename.endsWith('.module.css')) modules++;
      const source = fs.readFileSync(filename, 'utf8');
      if (/:global\b/.test(source)) failures.push(`${path.relative(root, filename)}: global selector`);
      for (const match of source.matchAll(/\.slot-([\w-]+)/g)) {
        if (!slots.has(match[1])) failures.push(`${path.relative(root, filename)}: unknown module slot ${match[1]}`);
      }
    }
    else if (/\.[cm]?[jt]sx?$/.test(filename) && forbidden.test(fs.readFileSync(filename, 'utf8'))) failures.push(path.relative(root, filename));
  }
}
visit(path.join(root, 'src'));
const manifest = require('../package.json');
for (const name of ['antd', 'styled-components', '@types/styled-components']) {
  if (manifest.dependencies?.[name] || manifest.devDependencies?.[name]) failures.push(`package.json: ${name}`);
}
if (failures.length) throw new Error(`UI migration violations:\n${failures.join('\n')}`);
console.log(`UI migration check passed: no legacy UI imports, direct dependencies, or global selectors; ${modules} CSS Modules.`);
