const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const forbidden = /(?:from\s*|import\s*\(?\s*|require\(\s*)['"](?:antd(?:\/[^'"]*)?|styled-components|@ant-design\/[^'"]*)['"]/;
const failures = [];
let modules = 0;
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(filename);
    else if (filename.endsWith('.module.css')) modules++;
    else if (/\.[cm]?[jt]sx?$/.test(filename) && forbidden.test(fs.readFileSync(filename, 'utf8'))) failures.push(path.relative(root, filename));
  }
}
visit(path.join(root, 'src'));
const manifest = require('../package.json');
for (const name of ['antd', 'styled-components', '@types/styled-components']) {
  if (manifest.dependencies?.[name] || manifest.devDependencies?.[name]) failures.push(`package.json: ${name}`);
}
if (failures.length) throw new Error(`Legacy UI dependencies remain:\n${failures.join('\n')}`);
console.log(`UI migration check passed: no legacy UI imports or direct dependencies; ${modules} CSS Modules.`);
