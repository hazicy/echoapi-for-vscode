const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Load a real source module while substituting host/UI dependencies at its boundary.
module.exports = (filename, dependencies, globals = {}) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: dependencies, ...globals }, { filename });
  return exports;
};
