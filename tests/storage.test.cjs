const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const loadTypeScript = require('./helpers/loadTypeScript.cjs');

function fixture(t, platform = 'linux', overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'okapi-storage-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const context = { globalStorageUri: { fsPath: path.join(root, 'extension') } };
  const events = [];
  const api = loadTypeScript('src/extension/db/index.ts', (id) => {
    if (id === 'os') return { ...os, homedir: () => root, platform: () => platform };
    if (id === 'fs') return { ...fs, ...overrides };
    if (id === '../storageEvents') return { storageChanged: { fire: (key) => events.push(key) } };
    return require(id);
  });
  const cache = (key) => path.join(root, 'echoapi_for_vscode', `${key}.json`);
  const extension = (key) => path.join(context.globalStorageUri.fsPath, `${key}.json`);
  const seed = (filename, value) => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(value));
  };
  const read = (key, fallback = []) => JSON.parse(JSON.stringify(api.getDataFromGlobalStorage(context, key, fallback)));
  return { ...api, root, context, cache, extension, seed, read, events };
}

for (const platform of ['linux', 'darwin', 'win32']) {
  test(`${platform}: platform detection and authoritative filenames`, (t) => {
    const f = fixture(t, platform);
    const key = 'apiList:project';
    const cacheKey = platform === 'linux' ? key : 'apiList_project';
    const extensionKey = platform === 'win32' ? cacheKey : key;
    assert.equal(f.isWin(), platform === 'win32');
    assert.equal(f.setDataToGlobalStorage(f.context, key, ['saved']), true);
    assert.deepEqual(f.read(key), ['saved']);
    assert.deepEqual(JSON.parse(fs.readFileSync(f.cache(cacheKey))), ['saved']);
    assert.deepEqual(JSON.parse(fs.readFileSync(f.extension(extensionKey))), ['saved']);
    assert.equal(f.getStorageFilePath(f.context, key), f.cache(cacheKey));
    assert.equal(f.existFileSync(f.context, key), true);
    assert.deepEqual(f.events, [key]);
  });
}

test('macOS keeps historical underscore cache precedence over colon cache and extension copy', (t) => {
  const f = fixture(t, 'darwin');
  f.seed(f.cache('apiList_project'), ['historical']);
  f.seed(f.cache('apiList:project'), ['older']);
  f.seed(f.extension('apiList:project'), ['mirror']);
  assert.deepEqual(f.read('apiList:project'), ['historical']);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList:project', ['updated']), true);
  assert.deepEqual(f.read('apiList:project'), ['updated']);
});

test('legacy colon cache and extension-only data remain readable without writes or events', (t) => {
  for (const platform of ['win32', 'darwin']) {
    const f = fixture(t, platform);
    f.seed(f.cache('apiList:legacy'), ['legacy']);
    assert.deepEqual(f.read('apiList:legacy'), ['legacy']);
    assert.equal(f.getStorageFilePath(f.context, 'apiList:legacy'), f.cache('apiList:legacy'));
    f.seed(f.extension('apiList:extension'), ['extension']);
    assert.deepEqual(f.read('apiList:extension'), ['extension']);
    assert.equal(fs.existsSync(f.cache('apiList_extension')), false);
    assert.deepEqual(f.events, []);
  }
});

test('damaged or wrong-shaped cache falls back to a valid copy and then to caller defaults', (t) => {
  const f = fixture(t, 'darwin');
  f.seed(f.cache('apiList_project'), { unexpected: true });
  f.seed(f.cache('apiList:project'), ['legacy']);
  assert.deepEqual(f.read('apiList:project'), ['legacy']);
  fs.writeFileSync(f.cache('apiList_project'), '{broken');
  fs.unlinkSync(f.cache('apiList:project'));
  f.seed(f.extension('apiList:project'), ['mirror']);
  assert.deepEqual(f.read('apiList:project'), ['mirror']);
  assert.deepEqual(f.read('missing', ['default']), ['default']);
  assert.equal(f.existFileSync(f.context, 'missing'), false);
  assert.deepEqual(f.events, []);
});

test('failed cache commit preserves both old copies, reports failure and leaves no temporary files', (t) => {
  const f = fixture(t, 'linux', { renameSync: () => { throw new Error('disk failure'); } });
  f.seed(f.cache('apiList'), ['old cache']);
  f.seed(f.extension('apiList'), ['old mirror']);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', ['new']), false);
  assert.deepEqual(f.read('apiList'), ['old cache']);
  assert.deepEqual(JSON.parse(fs.readFileSync(f.extension('apiList'))), ['old mirror']);
  assert.deepEqual(fs.readdirSync(path.dirname(f.cache('apiList'))), ['apiList.json']);
  assert.deepEqual(f.events, []);
});

test('failed mirror still reports a committed save and subsequent reads use the new cache', (t) => {
  let mirrorPath;
  const f = fixture(t, 'linux', { renameSync: (from, to) => {
    if (to === mirrorPath) throw new Error('mirror unavailable');
    fs.renameSync(from, to);
  } });
  mirrorPath = f.extension('apiList');
  f.seed(f.cache('apiList'), ['old']);
  f.seed(mirrorPath, ['old']);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', ['new']), true);
  assert.deepEqual(f.read('apiList'), ['new']);
  assert.deepEqual(JSON.parse(fs.readFileSync(mirrorPath)), ['old']);
  assert.deepEqual(fs.readdirSync(path.dirname(mirrorPath)), ['apiList.json']);
  assert.deepEqual(f.events, ['apiList']);
});

test('serialization failures do not modify existing data or emit change events', (t) => {
  const f = fixture(t);
  f.seed(f.cache('apiList'), ['old']);
  const circular = {};
  circular.self = circular;
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', circular), false);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', undefined), false);
  assert.deepEqual(f.read('apiList'), ['old']);
  assert.deepEqual(f.events, []);
});

test('interrupted temporary writes preserve the committed JSON and clean up partial data', (t) => {
  const f = fixture(t, 'linux', { writeFileSync: (filename, data, options) => {
    fs.writeFileSync(filename, data.slice(0, 2), options);
    throw new Error('write interrupted');
  } });
  f.seed(f.cache('apiList'), ['old']);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', ['new']), false);
  assert.deepEqual(f.read('apiList'), ['old']);
  assert.deepEqual(fs.readdirSync(path.dirname(f.cache('apiList'))), ['apiList.json']);
  assert.deepEqual(f.events, []);
});

test('cache directory creation failure leaves the extension fallback untouched', (t) => {
  const f = fixture(t, 'linux', { mkdirSync: () => { throw new Error('permission denied'); } });
  f.seed(f.extension('apiList'), ['old mirror']);
  assert.equal(f.setDataToGlobalStorage(f.context, 'apiList', ['new']), false);
  assert.deepEqual(f.read('apiList'), ['old mirror']);
  assert.deepEqual(f.events, []);
});
