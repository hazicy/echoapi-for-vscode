const assert = require('node:assert/strict');
const Module = require('node:module');

// VS Code supplies this module at runtime. Loading the bundle here catches
// dependency initialization and CommonJS/ESM interop errors before packaging.
// This checks module loading, not activation against the full VS Code API.
const originalLoad = Module._load;
try {
  Module._load = function (id, ...args) {
    return id === 'vscode' ? { EventEmitter: class {
      event = () => ({ dispose() {} });
      fire() {}
      dispose() {}
    } } : originalLoad.call(this, id, ...args);
  };
  const extension = require('../dist/extension.js');
  assert.equal(typeof extension.activate, 'function');
  console.log('Extension bundle loads and exports activate.');
} finally {
  Module._load = originalLoad;
}
