const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/loadTypeScript.cjs');
const { buildOAuth2VariableMap, resolveOAuth2Variables, resolveOAuth2Parameters } = load('src/features/requests/utils/oauth2Variables.ts', id => require(id));
const plain = value => JSON.parse(JSON.stringify(value));

test('environment values override globals without leaking overrides into later calculations', () => {
  const globals = { token: { current_value: 'global' }, numeric: { current_value: 0 }, object: { current_value: { key: true } } };
  const environment = { token: { current_value: 'environment' }, local: { current_value: '' } };
  const snapshot = structuredClone({ globals, environment });
  assert.deepEqual(plain(buildOAuth2VariableMap(globals, environment)), { token: 'environment', numeric: '0', object: '{"key":true}', local: '' });
  assert.deepEqual(plain(buildOAuth2VariableMap(globals, undefined)), { token: 'global', numeric: '0', object: '{"key":true}' });
  assert.deepEqual({ globals, environment }, snapshot);
});

test('variable replacement handles repeated, empty and literal special variables', async () => {
  const variables = { host: 'example.com', empty: '', 'dotted.key': 'literal', missingValue: undefined };
  assert.equal(await resolveOAuth2Variables('https://{{host}}/{{host}}/{{empty}}', variables), 'https://example.com/example.com/');
  assert.equal(await resolveOAuth2Variables('{{dotted.key}}/{{missingValue}}', variables), 'literal/undefined');
  assert.equal(await resolveOAuth2Variables('{{$dynamic}}/{{!special}}', {}), '{{$dynamic}}/{{!special}}');
  assert.equal(await resolveOAuth2Variables(undefined, {}), '');
});

test('missing variables reject with the original first missing name', async () => {
  await assert.rejects(resolveOAuth2Variables('{{first}}/{{second}}', {}), error => error === 'first');
  await assert.rejects(resolveOAuth2Parameters([{ key: '{{key}}', value: '{{value}}' }], {}), error => error === 'key');
  await assert.rejects(resolveOAuth2Parameters([{ key: 'key', value: '{{value}}' }, { key: '{{later}}', value: '' }], {}), error => error === 'value');
});

test('parameter substitution preserves metadata and ordering without changing input', async () => {
  const input = [{ key: '', value: '{{unknown}}' }, { key: '{{key}}', value: '{{value}}', enabled: false, send_as: 'header' }, { key: 'literal', value: 'unchanged' }, { key: '{{empty}}', value: 'ignored' }];
  const snapshot = structuredClone(input);
  const result = await resolveOAuth2Parameters(input, { key: 'resolved', value: 'token', empty: '' });
  assert.deepEqual(plain(result), [{ key: 'resolved', value: 'token', enabled: false, send_as: 'header' }, { key: 'literal', value: 'unchanged' }]);
  assert.deepEqual(input, snapshot);
});
