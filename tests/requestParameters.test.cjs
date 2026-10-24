const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Isolate parameter reconciliation from the UI store and transport dependencies.
const source = fs.readFileSync('src/features/requests/utils/apis.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
let nextId = 0;
vm.runInNewContext(compiled, {
  exports: exportsObject,
  require: (id) => {
    if (id === 'lodash' || id === 'url-parse') return require(id);
    if (id === 'apipost-tools') return { snowflakeId: () => `new-${++nextId}` };
    if (id.endsWith('/constants/common')) return { STATUS_CODE: { ENABLE: 1, DISABLE: -1 } };
    if (id.endsWith('/utils/common')) return {
      isURL: (url) => url.startsWith('http'),
      createUrl: (url) => new URL(url),
      getUrlQueryToArray: (query) => [...new URLSearchParams(query)].map(([key, value]) => ({ key, value })),
    };
    return {};
  },
});
const { genQueryByUrl, genRestfulByUrl } = exportsObject;
const plain = (value) => JSON.parse(JSON.stringify(value));
const row = (key, extra = {}) => ({ key, param_id: key, is_checked: 1, value: 'saved', description: 'description', ...extra });

test('query reconciliation preserves disabled rows and enabled metadata by position', () => {
  const saved = [row('disabled', { is_checked: -1 }), row('old', { field_type: 'Integer', not_null: -1 })];
  const snapshot = structuredClone(saved);
  const result = plain(genQueryByUrl('example.com?a=1&a=2', saved));
  assert.deepEqual(result[0], saved[0]);
  assert.deepEqual(result[1], { ...saved[1], key: 'a', value: '1' });
  assert.equal(result[2].key, 'a');
  assert.equal(result[2].value, '2');
  assert.match(result[2].param_id, /^new-/);
  assert.deepEqual(saved, snapshot);
  assert.deepEqual(plain(genQueryByUrl('example.com', saved)), [saved[0]]);
});

test('REST reconciliation preserves order, repeated keys and the first saved match', () => {
  const saved = [row('id'), row('id', { value: 'second' }), row('name')];
  const snapshot = structuredClone(saved);
  const result = plain(genRestfulByUrl('example.com/:id/:id/{name}/{{variable}}/{fresh}', saved));
  assert.deepEqual(result.map((item) => item.key), ['id', 'id', 'name', 'fresh']);
  assert.deepEqual(result.slice(0, 2).map((item) => item.value), ['saved', 'saved']);
  assert.equal(result[2].param_id, 'name');
  assert.equal(result[3].value, '');
  assert.match(result[3].param_id, /^new-/);
  assert.deepEqual(saved, snapshot);
  assert.deepEqual(plain(genRestfulByUrl('example.com/static', saved)), []);
});
