const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/loadTypeScript.cjs');
const path = require('node:path');
const { requestDecoration: decorate, setRequestDraft, setRequestResult } = load(
  path.resolve(__dirname, '../src/extension/requestStatus.ts'),
  () => ({ EventEmitter: class { fire() {} } }),
);
const request = { target_id: 'r', target_type: 'api', url: '/users', request: {} };
const get = (workspace = 'one', data = request, config = {}) => decorate(workspace, data, config, [data]);
test('results, dirty state, priority, clearing drafts, and workspace isolation', () => {
  assert.equal(get(), undefined);
  setRequestResult('one', 'r', { code: 200 });
  assert.equal(get().badge, '✓');
  setRequestResult('one', 'r', { code: 404 });
  assert.equal(get().badge, '!');
  setRequestResult('one', 'r', undefined, { code: 'ETIMEDOUT' });
  assert.equal(get().badge, 'T');
  setRequestDraft('one', 'r', request);
  assert.equal(get().badge, 'M');
  assert.match(get().tooltip, /timed out/);
  setRequestDraft('one', 'r', { ...request, url: '{{missing}}' });
  assert.equal(get().badge, 'E');
  setRequestDraft('one', 'r', { ...request, url: '' });
  assert.equal(get().badge, '!');
  assert.match(get().tooltip, /Missing URL/);
  setRequestDraft('one', 'r');
  assert.equal(get().badge, 'T');
  assert.equal(get('two'), undefined);
});
test('validation ignores disabled rows, examples, dynamic expressions; follows nested variables', () => {
  const config = { envDetailKeys: 'env', envList: [{ env_id: 'env', env_var_list: {
    host: { current_value: '{{domain}}' }, domain: { value: 'example.com' }, empty: { current_value: '' },
  } }] };
  const data = { ...request, url: 'https://{{host}}/{{empty}}/{{$random}}/{{@ai()}}/{{\'literal\'}}/{{domain|upper()}}',
    response: { raw: '{{example}}' }, request: { query: { parameter: [
      { key: '', value: '' }, { key: '', value: '{{disabled}}', is_checked: -1 },
    ] } } };
  assert.equal(get('validation', data, config), undefined);
  data.request.query.parameter.push({ key: '', value: 'bad', is_checked: 1 });
  assert.match(get('validation', data, config).tooltip, /Empty parameter name/);
  data.request = { body: { mode: 'json', raw: '{bad}' } };
  assert.match(get('validation', data, config).tooltip, /Invalid JSON body/);
  data.request = {};
  config.envList[0].env_var_list.domain.value = '{{unknown}}';
  assert.match(get('validation', data, config).tooltip, /unknown/);
  assert.equal(get('validation', { ...data, target_type: 'folder' }, config), undefined);
});
test('inherits base URL and parameters without looping on cyclic folders', () => {
  const data = { ...request, url: '', parent_id: 'folder' };
  const folder = { target_id: 'folder', parent_id: 'folder', server_id: 's', request: { header: { parameter: [{ key: 'X-Key', value: '{{token}}' }] } } };
  const config = { envDetailKeys: 'env', envList: [{ env_id: 'env', server_list: [{ server_id: 's', uri: 'https://example.com' }] }] };
  assert.equal(decorate('inherited', data, config, [data, folder]).badge, 'E');
});
