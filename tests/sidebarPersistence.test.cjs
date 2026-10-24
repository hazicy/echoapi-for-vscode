const { test } = require('node:test');
const assert = require('node:assert/strict');
const loadTypeScript = require('./helpers/loadTypeScript.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
function fixture(writeSucceeds = true) {
  const calls = [];
  let persisted = [{ target_id: 'original', parent_id: 'folder', name: 'Request', sort: 4, version: 3 }];
  const panel = (name) => ({ webview: { postMessage: (message) => calls.push([name, plain(message)]) } });
  const globalConfig = {
    sidePanelWebView: panel('sidebar'),
    pushWebView: panel('push'),
    shareListWebView: panel('share'),
    openedPanels: {},
    openedFolderTestPanels: { 'project:folder:test': panel('test') },
  };
  const { handleMessage } = loadTypeScript('src/extension/messageHandler/sidbar.ts', (id) => {
    if (id === 'lodash') return require(id);
    if (id === '../constants') return { globalConfig };
    if (id === '../utils') return {
      getApiList: () => structuredClone(persisted),
      getMaxSort: () => 5,
      setApiList: (rows) => {
        calls.push(['write', plain(rows)]);
        if (writeSucceeds) persisted = plain(rows);
        return writeSucceeds;
      },
      getAllApiChildren: () => {
        calls.push(['readChildren']);
        return persisted;
      },
    };
    if (id === '../apis') return { updateOpenData: (_, data) => calls.push(['open', plain(data)]) };
    if (id === 'apipost-tools') return { snowflakeId: () => 'copy' };
    if (id === 'vscode') return { window: {
      showErrorMessage: (message) => calls.push(['error', message]),
      showInformationMessage: (message) => calls.push(['success', message]),
    } };
    return {};
  });
  return { handleMessage, calls, rows: () => persisted };
}

test('saving a new folder persists before notifying every dependent view', async () => {
  const f = fixture();
  assert.equal(await f.handleMessage({ action: 'saveFolder', data: { target_id: 'new', parent_id: 'folder' } }, {}), true);
  assert.equal(f.calls[0][0], 'write');
  assert.equal(f.rows()[1].sort, 5);
  assert.deepEqual(f.calls.map(([name]) => name), ['write', 'sidebar', 'push', 'share', 'readChildren', 'test']);
  assert.deepEqual(f.calls.at(-1)[1].data.ventList, f.rows());
});

test('renaming replaces the saved row and updates the open panel after the write', async () => {
  const f = fixture();
  await f.handleMessage({ action: 'saveFolder', data: { target_id: 'original', name: 'Renamed', sort: 4 } }, {});
  assert.equal(f.rows().length, 1);
  assert.equal(f.rows()[0].name, 'Renamed');
  assert.deepEqual(f.calls.slice(0, 2).map(([name]) => name), ['write', 'open']);
});

test('cloning persists a new ID and reset version without modifying the original', async () => {
  const f = fixture();
  const original = structuredClone(f.rows()[0]);
  await f.handleMessage({ action: 'cloneApi', data: { target_id: 'original' } }, {});
  assert.deepEqual(f.rows()[0], original);
  assert.deepEqual(f.rows()[1], { ...original, target_id: 'copy', version: 0, name: 'Request Copy', sort: 5 });
  assert.equal(f.calls.at(-1)[0], 'success');
});

test('failed saves keep persisted data and do not broadcast or report success', async () => {
  for (const action of ['saveFolder', 'cloneApi']) {
    const f = fixture(false);
    const original = structuredClone(f.rows());
    await f.handleMessage({ action, data: { target_id: 'original', name: 'Changed' } }, {});
    assert.deepEqual(f.rows(), original);
    assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
  }
});

test('setApiList propagates the actual storage result and selects the project key', () => {
  for (const expected of [true, false]) {
    const writes = [];
    const { setApiList } = loadTypeScript('src/extension/utils.ts', (id) => {
      if (id === './db') return { setDataToGlobalStorage: (...args) => { writes.push(args); return expected; } };
      return {};
    });
    const context = { globalState: { get: () => ({ currentProject: { project_id: 'workspace' } }) } };
    const rows = [{ target_id: 'saved' }];
    assert.equal(setApiList(rows, context), expected);
    assert.equal(writes[0][0], context);
    assert.equal(writes[0][1], 'apiList:workspace');
    assert.equal(writes[0][2], rows);
  }
});

test('opening a request deleted since the UI rendered safely skips both message handlers', async () => {
  for (const [filename, handler] of [
    ['sidbar.ts', 'handleMessage'],
    ['open.ts', 'handelOpenMessage'],
  ]) {
    const commands = [];
    const handlers = loadTypeScript(`src/extension/messageHandler/${filename}`, (id) => {
      if (id === '../utils') return { getApiList: () => [] };
      if (id === '../constants') return { globalConfig: {} };
      if (id === 'vscode') return { commands: { executeCommand: (...args) => commands.push(args) } };
      return {};
    });
    await handlers[handler]({ action: 'openTagPanelById', data: 'deleted' }, {}, {}, {});
    assert.deepEqual(commands, []);
  }
});

test('folder test adapter reads the current project and preserves event metadata', () => {
  const tree = loadTypeScript('src/extension/utils/collectionTree.ts', () => ({}));
  const rows = [{ target_id: 'request', parent_id: 'folder', target_type: 'api', sort: 1 }];
  const reads = [];
  const { getAllApiChildren } = loadTypeScript('src/extension/utils.ts', (id) => {
    if (id === './utils/collectionTree') return tree;
    if (id === './db') return { getDataFromGlobalStorage: (_, key) => { reads.push(key); return rows; } };
    if (id === '@/features/testing/constants') return { CASE_ITEM_TYPE: { API: 'api' } };
    return {};
  });
  const context = { globalState: { get: () => ({ currentProject: { project_id: 'workspace' } }) } };
  assert.deepEqual(plain(getAllApiChildren('folder', context)), [{
    event_id: 'request', test_id: 'folder', type: 'api', enabled: 1, sort: 1,
    data: rows[0], parent_event_id: '0', auto_sync: true, project_id: '-1',
  }]);
  assert.deepEqual(reads, ['apiList:workspace']);
});
