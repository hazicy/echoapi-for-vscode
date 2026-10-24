const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/loadTypeScript.cjs');
const plain = (value) => JSON.parse(JSON.stringify(value));

function fixture(file, { succeeds = true, environmentSucceeds = true, cleanupSucceeds = true, confirmation } = {}) {
  const calls = [];
  let rows = [
    { target_id: 'folder', parent_id: '0', target_type: 'folder', sort: 1 },
    { target_id: 'request', parent_id: 'folder', target_type: 'api', name: 'Original', sort: 1 },
    { target_id: 'other', parent_id: '0', target_type: 'api', sort: 2 },
  ];
  let project = 'one';
  const panel = (name) => ({ title: 'Unsaved ⚈', webview: { postMessage: (message) => calls.push([name, plain(message)]) }, dispose: () => calls.push(['dispose', name]) });
  const editor = panel('editor');
  const config = { sidePanelWebView: panel('sidebar'), pushWebView: panel('push'), shareListWebView: panel('share'), importDataWebView: panel('import'), openedPanels: { request: editor }, openedFolderTestPanels: {} };
  const tree = load('src/extension/utils/collectionTree.ts', () => ({}));
  const exports = load(`src/extension/messageHandler/${file}.ts`, (id) => {
    if (id === 'lodash') return require(id);
    if (id === '../constants') return { globalConfig: config, DEFAULT_TARGET_NAME: { api: 'HTTP Request' } };
    if (id === '../utils') return {
      getApiList: () => structuredClone(rows),
      getApiListName: () => project,
      getMaxSort: (list, parent) => Math.max(0, ...list.filter(item => item.parent_id === parent).map(item => item.sort)) + 1,
      setApiList: (list) => { calls.push(['write', plain(list)]); if (succeeds) rows = plain(list); return succeeds; },
      setProjectApisVersion: () => calls.push(['version']),
      getAllChildIds: tree.getCollectionChildIds,
      getTestingFolderName: (id) => id,
      deleteTestingFoldersData: (ids) => { calls.push(['deleteTest', [...ids]]); return cleanupSucceeds; },
      showTabName: (name) => name,
      getCurrentProjectConfig: () => ({ envList: [], serverList: [] }),
      setProjectConfig: () => { calls.push(['writeEnv']); return environmentSucceeds; },
    };
    if (id === '../apis') return { updateOpenData: (_, data) => calls.push(['open', plain(data)]) };
    if (id === '../utils/share') return { getProjectShareData: () => { calls.push(['shareRead']); return {}; } };
    if (id === '@/features/requests/utils/apis') return { createBatchApi: (items) => items };
    if (id === 'vscode') return { window: {
      showInputBox: async () => 'Renamed',
      showErrorMessage: (message) => calls.push(['error', message]),
      showInformationMessage: async (message, options) => {
        if (options?.modal) return confirmation ? confirmation() : 'Yes';
        calls.push(['success', message]);
      },
    } };
    return {};
  });
  const handler = exports.handleMessage || exports.handelOpenMessage || exports.handelImportDataMessage;
  return { calls, editor, config, panel, rows: () => rows, replace: (list) => { rows = list; }, switchProject: () => { project = 'two'; }, run: (action, data) => handler({ action, data }, {}, editor, {}) };
}

test('editor save failure preserves dirty title and input and sends no saved-state updates', async () => {
  const f = fixture('open', { succeeds: false });
  const input = { target_id: 'request', target_type: 'api', name: '', is_create: 1 };
  const snapshot = structuredClone(input);
  await f.run('saveApiData', input);
  assert.deepEqual(input, snapshot);
  assert.equal(f.editor.title, 'Unsaved ⚈');
  assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
});

test('editor save commits before clearing dirty state, broadcasting or reporting success', async () => {
  const f = fixture('open');
  await f.run('saveApiData', { target_id: 'request', target_type: 'api', name: 'Renamed' });
  assert.equal(f.calls[0][0], 'write');
  assert.equal(f.editor.title, 'Renamed');
  assert.equal(f.rows()[1].is_create, -1);
  assert.equal(f.calls.at(-1)[0], 'success');
});

for (const succeeds of [true, false]) {
  test(`bulk list replacement handles storage result ${succeeds} before updating versions and views`, async () => {
    const f = fixture('sidbar', { succeeds });
    await f.run('setApiList', [{ target_id: 'request', name: 'Updated' }]);
    assert.equal(f.calls[0][0], 'write');
    if (!succeeds) assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
    else assert.deepEqual(f.calls.map(([name]) => name), ['write', 'version', 'editor', 'push', 'share']);
  });

  test(`folder deletion handles storage result ${succeeds} before closing tabs or deleting tests`, async () => {
    const f = fixture('sidbar', { succeeds });
    await f.run('showConfirmation', { target_id: 'folder', title: 'Delete?' });
    assert.equal(f.calls[0][0], 'write');
    if (!succeeds) {
      assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
      assert.equal(f.rows().length, 3);
    } else {
      assert.deepEqual(f.rows().map(item => item.target_id), ['other']);
      assert.ok(f.calls.find(([name]) => name === 'dispose'));
      assert.ok(f.calls.find(([name]) => name === 'deleteTest'));
    }
  });
}

test('delete confirmation preserves concurrent edits and aborts after a workspace switch', async () => {
  let f;
  f = fixture('sidbar', { confirmation: () => {
    f.replace([...f.rows(), { target_id: 'concurrent', parent_id: '0', target_type: 'api' }]);
    return 'Yes';
  } });
  await f.run('showConfirmation', { target_id: 'folder' });
  assert.deepEqual(f.rows().map(item => item.target_id), ['other', 'concurrent']);
  f = fixture('sidbar', { confirmation: () => { f.switchProject(); return 'Yes'; } });
  await f.run('showConfirmation', { target_id: 'folder' });
  assert.deepEqual(f.calls, []);
});

for (const [after, before, expected] of [['0', '0', ['folder', 'other', 'request']], ['0', 'folder', ['folder', 'request', 'other']], ['folder', '0', ['request', 'folder', 'other']]]) {
  test(`drop ${after}/${before} orders siblings and updates panels only after save`, async () => {
    for (const succeeds of [true, false]) {
      const f = fixture('sidbar', { succeeds });
      await f.run('onDrop', { target_ids: ['request'], parent_id: '0', after_target_id: after, before_target_id: before });
      assert.equal(f.calls[0][0], 'write');
      if (!succeeds) assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
      else {
        assert.deepEqual(f.rows().filter(item => item.parent_id === '0').sort((a, b) => a.sort - b.sort).map(item => item.target_id), expected);
        assert.equal(f.calls.at(-1)[0], 'success');
      }
    }
  });
}

test('import storage failures keep the import panel open and never report complete success', async () => {
  for (const [succeeds, environmentSucceeds, envs, expected] of [
    [false, true, [], ['write', 'error']],
    [true, false, [{ env_id: 'env' }], ['writeEnv', 'error']],
    [false, true, [{ env_id: 'env' }], ['writeEnv', 'write', 'error']],
  ]) {
    const f = fixture('importData', { succeeds, environmentSucceeds });
    await f.run('importData', { chooseFolder: '0', newApis: [{ target_id: 'imported' }], newEnvs: envs });
    assert.deepEqual(f.calls.map(([name]) => name), expected);
    if (envs.length && !succeeds) assert.match(f.calls.at(-1)[1], /environments were saved/);
  }
});

test('successful import broadcasts and closes the panel after the request write', async () => {
  const f = fixture('importData');
  await f.run('importData', { chooseFolder: '0', newApis: [{ target_id: 'imported' }], newEnvs: [] });
  assert.deepEqual(f.calls.map(([name]) => name), ['write', 'sidebar', 'success', 'dispose']);
});

test('folder rename updates open test titles only after the saved message commits', async () => {
  for (const succeeds of [true, false]) {
    const f = fixture('sidbar', { succeeds });
    const testPanel = f.panel('test');
    f.config.openedFolderTestPanels.folder = testPanel;
    await f.run('showInputBox', { type: 'folder', sourceData: f.rows()[0] });
    assert.equal(testPanel.title, 'Unsaved ⚈');
    assert.deepEqual(f.calls.map(([name]) => name), ['sidebar']);
    f.calls.length = 0;
    await f.run('saveFolder', { ...f.rows()[0], name: 'Renamed' });
    assert.equal(f.calls[0][0], 'write');
    if (succeeds) assert.equal(testPanel.title, 'Renamed');
    else {
      assert.equal(testPanel.title, 'Unsaved ⚈');
      assert.deepEqual(f.calls.map(([name]) => name), ['write', 'error']);
    }
  }
});

test('folder test cleanup runs once per deletion and reports partial cleanup failure', async () => {
  const f = fixture('sidbar', { cleanupSucceeds: false });
  await f.run('showConfirmation', { target_id: 'folder' });
  assert.deepEqual(f.rows().map(item => item.target_id), ['other']);
  assert.deepEqual(f.calls.filter(([name]) => name === 'deleteTest'), [['deleteTest', ['folder', 'request']]]);
  assert.match(f.calls.find(([name]) => name === 'error')[1], /deleted.*test data/);
  assert.ok(f.calls.find(([name]) => name === 'sidebar'));
});

test('batch test cleanup writes once and propagates the storage result', () => {
  for (const result of [true, false]) {
    const writes = [];
    const { deleteTestingFoldersData } = load('src/extension/utils.ts', (id) => {
      if (id === './db') return {
        getDataFromGlobalStorage: () => ({ folder: {}, request: {}, keep: { data: 'retained' } }),
        setDataToGlobalStorage: (_, key, value) => { writes.push([key, plain(value)]); return result; },
      };
      return {};
    });
    const context = { globalState: { get: () => ({ currentProject: { project_id: 'one' } }) } };
    assert.equal(deleteTestingFoldersData(['folder', 'request'], context), result);
    assert.equal(writes.length, 1);
    assert.deepEqual(writes[0][1], { keep: { data: 'retained' } });
  }
});
