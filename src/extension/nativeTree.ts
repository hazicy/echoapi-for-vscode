import * as vscode from 'vscode';
import { snowflakeId } from 'apipost-tools';
import { cloneDeep } from 'lodash';
import { getApiList, getProjectReportList } from './utils';
import { getRequestHistory, RequestHistoryEntry } from './requestHistory';
import type { TestingReportList } from '@/features/testing/types/res';
import { nativeTreeChanged } from './nativeTreeEvents';
import { handleMessage } from './messageHandler/sidbar';
import { APIS_BASE_DEFAULT_DATA } from '@/features/requests/constants/common';
import { APIS_TARGET_TYPE_ENUM } from '@/features/requests/constants';
import type { ApiDetailsData } from '@/features/requests/types/api';

type Section = 'requests' | 'tests' | 'history';
type TreeNode =
  | { kind: 'request'; data: ApiDetailsData }
  | { kind: 'testFolder'; data: ApiDetailsData }
  | { kind: 'reports' }
  | { kind: 'report'; data: TestingReportList }
  | { kind: 'day'; day: string }
  | { kind: 'history'; data: RequestHistoryEntry }
  | { kind: 'empty'; label: string; id: string };

function dayKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function registerNativeTree(context: vscode.ExtensionContext) {
  const changed = new vscode.EventEmitter<TreeNode | undefined>();
  const zh = vscode.env.language.startsWith('zh');
  let filter = '';
  const list = (): ApiDetailsData[] => getApiList(context).filter((item: ApiDetailsData) => !item.is_deleted || item.is_deleted === -1);
  const matches = (data: ApiDetailsData) => `${data.name} ${data.url || ''} ${data.method || ''}`.toLowerCase().includes(filter);
  const history = () => getRequestHistory(context).filter(entry => matches(entry.request));
  const children = (parent?: ApiDetailsData, foldersOnly = false) => {
    const all = list();
    const visible = new Set<string>();
    if (filter && !foldersOnly) {
      for (const item of all) {
        if (!matches(item)) { continue; }
        let current: ApiDetailsData | undefined = item;
        const visited = new Set<string>();
        while (current && !visited.has(String(current.target_id))) {
          visited.add(String(current.target_id));
          visible.add(String(current.target_id));
          current = all.find(row => String(row.target_id) === String(current?.parent_id));
        }
      }
    }
    return all.filter(item => (!foldersOnly || item.target_type === 'folder') && (parent ? String(item.parent_id) === String(parent.target_id) : !item.parent_id || String(item.parent_id) === '0' || !all.some(row => String(row.target_id) === String(item.parent_id))) && (!filter || foldersOnly || visible.has(String(item.target_id))))
      .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  };
  const empty = (label: string, id: string): TreeNode[] => [{ kind: 'empty', label, id }];
  const requestItem = (data: ApiDetailsData, prefix: string) => {
    const folder = data.target_type === 'folder';
    const item = new vscode.TreeItem(data.name || '', folder ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
    item.id = `${prefix}:${data.target_id}`;
    item.contextValue = folder ? 'okapiFolder' : 'okapiRequest';
    item.description = folder ? undefined : String(data.method || data.target_type).toUpperCase();
    const method = String(data.method || '').toUpperCase();
    const color = method === 'POST' ? 'charts.yellow' : method === 'DELETE' ? 'charts.red' : method === 'PUT' || method === 'PATCH' ? 'charts.blue' : 'charts.green';
    item.iconPath = new vscode.ThemeIcon(folder ? 'folder' : 'symbol-event', folder ? undefined : new vscode.ThemeColor(color));
    item.tooltip = [data.name, data.method, data.url].filter(Boolean).join(' ');
    return item;
  };
  const provider = (section: Section): vscode.TreeDataProvider<TreeNode> => ({
    onDidChangeTreeData: changed.event,
    getTreeItem(node) {
      switch (node.kind) {
        case 'request': {
          const item = requestItem(node.data, 'request');
          if (node.data.target_type !== 'folder') { item.command = { command: 'okapi.tree.open', title: 'Open Request', arguments: [node] }; }
          return item;
        }
        case 'testFolder': {
          const item = requestItem(node.data, 'test');
          item.collapsibleState = children(node.data, true).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
          item.contextValue = 'okapiTestFolder';
          item.iconPath = new vscode.ThemeIcon('beaker');
          item.command = { command: 'okapi.tree.runTests', title: 'Open Tests', arguments: [node] };
          item.tooltip = zh ? `${node.data.name}：打开测试配置与运行页面` : `${node.data.name}: open test configuration and runner`;
          return item;
        }
        case 'reports': {
          const item = new vscode.TreeItem(zh ? '测试报告' : 'Test Reports', vscode.TreeItemCollapsibleState.Collapsed);
          item.id = 'test-reports';
          item.iconPath = new vscode.ThemeIcon('checklist');
          item.description = String(getProjectReportList(context).length);
          return item;
        }
        case 'report': {
          const item = new vscode.TreeItem(node.data.report_name || (zh ? '测试报告' : 'Test Report'));
          item.id = `report:${node.data.report_id}`;
          item.contextValue = 'okapiReport';
          const http = node.data.complete?.http;
          item.iconPath = new vscode.ThemeIcon(http?.success === http?.total ? 'pass' : 'error', new vscode.ThemeColor(http?.success === http?.total ? 'testing.iconPassed' : 'testing.iconFailed'));
          item.description = node.data.complete?.start_at ? new Date(node.data.complete.start_at).toLocaleString() : undefined;
          item.command = { command: 'okapi.tree.openReport', title: 'Open Report', arguments: [node] };
          return item;
        }
        case 'day': {
          const item = new vscode.TreeItem(node.day, vscode.TreeItemCollapsibleState.Expanded);
          item.id = `history-day:${node.day}`;
          item.iconPath = new vscode.ThemeIcon('calendar');
          item.description = String(history().filter(entry => dayKey(entry.sentAt) === node.day).length);
          return item;
        }
        case 'history': {
          const item = requestItem(node.data.request, 'history');
          item.id = `history:${node.data.id}`;
          item.collapsibleState = vscode.TreeItemCollapsibleState.None;
          item.contextValue = 'okapiHistory';
          item.description = `${node.data.request.method || node.data.request.target_type.toUpperCase()} · ${new Date(node.data.sentAt).toLocaleTimeString()}`;
          item.tooltip = `${item.tooltip}\n${new Date(node.data.sentAt).toLocaleString()}`;
          item.command = { command: 'okapi.tree.openHistory', title: 'Open Historical Request', arguments: [node] };
          return item;
        }
        case 'empty': {
          const item = new vscode.TreeItem(node.label);
          item.id = node.id;
          item.iconPath = new vscode.ThemeIcon('info');
          return item;
        }
      }
    },
    getChildren(node): TreeNode[] {
      if (!node) {
        if (section === 'requests') {
          const rows = children().map(data => ({ kind: 'request' as const, data }));
          return rows.length ? rows : empty(zh ? '暂无接口，点击 + 新建' : 'No requests. Use + to create one.', 'empty:requests');
        }
        if (section === 'tests') {
          return [...children(undefined, true).map(data => ({ kind: 'testFolder' as const, data })), { kind: 'reports' }];
        }
        const days = [...new Set(history().map(entry => dayKey(entry.sentAt)))];
        return days.length ? days.map(day => ({ kind: 'day', day })) : empty(zh ? '发送请求后会显示在这里' : 'Sent requests will appear here.', 'empty:history');
      }
      if (node.kind === 'request') { return children(node.data).map(data => ({ kind: 'request', data })); }
      if (node.kind === 'testFolder') { return children(node.data, true).map(data => ({ kind: 'testFolder', data })); }
      if (node.kind === 'reports') {
        const reports = getProjectReportList(context);
        return reports.length ? reports.map(data => ({ kind: 'report', data })) : empty(zh ? '暂无测试报告' : 'No test reports yet.', 'empty:reports');
      }
      if (node.kind === 'day') { return history().filter(entry => dayKey(entry.sentAt) === node.day).map(data => ({ kind: 'history', data })); }
      return [];
    },
    getParent(node) {
      if (node.kind === 'request' || node.kind === 'testFolder') {
        const parent = list().find(row => String(row.target_id) === String(node.data.parent_id));
        return parent ? { kind: node.kind, data: parent } : undefined;
      }
      if (node.kind === 'history') { return { kind: 'day', day: dayKey(node.data.sentAt) }; }
      if (node.kind === 'day') { return undefined; }
      if (node.kind === 'report') { return { kind: 'reports' }; }
      return undefined;
    },
  });
  const view = vscode.window.createTreeView('okapiRequests', { treeDataProvider: provider('requests'), showCollapseAll: true });
  const testsView = vscode.window.createTreeView('okapiTests', { treeDataProvider: provider('tests'), showCollapseAll: true });
  const historyView = vscode.window.createTreeView('okapiHistory', { treeDataProvider: provider('history'), showCollapseAll: true });
  context.subscriptions.push(view, testsView, historyView, changed, nativeTreeChanged.event(() => changed.fire(undefined)));
  const command = (id: string, callback: (...args: any[]) => any) => context.subscriptions.push(vscode.commands.registerCommand(id, callback));
  command('okapi.tree.open', (node: Extract<TreeNode, { kind: 'request' }>) => handleMessage({ action: 'openTagPanelById', data: node.data.target_id }, context));
  command('okapi.tree.runTests', async (node?: Extract<TreeNode, { kind: 'testFolder' }>) => {
    let data = node?.data;
    if (!data) {
      const folders = list().filter(item => item.target_type === 'folder');
      if (!folders.length) {
        await vscode.window.showInformationMessage(zh ? '请先在接口中创建目录并添加请求。' : 'Create a request folder and add requests first.');
        return;
      }
      const selected = await vscode.window.showQuickPick(folders.map(data => ({ label: data.name, data })), { title: zh ? '选择测试目录' : 'Select Test Folder' });
      data = selected?.data;
    }
    if (data) { await vscode.commands.executeCommand('echoapi.folderTest', data); }
  });
  command('okapi.tree.openReport', (node: Extract<TreeNode, { kind: 'report' }>) => vscode.commands.executeCommand('echoapi.folderTestReportData', node.data));
  command('okapi.tree.deleteReport', (node: Extract<TreeNode, { kind: 'report' }>) => handleMessage({ action: 'deleteReport', data: { report_id: node.data.report_id } }, context));
  command('okapi.tree.openHistory', (node: Extract<TreeNode, { kind: 'history' }>) => {
    const request = node.data.request;
    const data = { ...cloneDeep(APIS_BASE_DEFAULT_DATA[request.target_type]), ...cloneDeep(request), target_id: `history-${node.data.id}`, is_create: 1, is_changed: 1 };
    return vscode.commands.executeCommand('openTabPanel', data);
  });
  command('okapi.tree.refresh', () => changed.fire(undefined));
  command('okapi.tree.filter', async () => {
    const value = await vscode.window.showInputBox({ title: zh ? '筛选接口和历史' : 'Filter Requests and History', prompt: zh ? '按名称、URL 或方法筛选；清空显示全部' : 'Filter by name, URL or method; clear to show all', value: filter });
    if (value === undefined) { return; }
    filter = value.trim().toLowerCase();
    view.message = filter ? `${zh ? '筛选' : 'Filter'}: ${value}` : undefined;
    historyView.message = view.message;
    changed.fire(undefined);
  });
  command('okapi.tree.new', async (node?: TreeNode) => {
    const parent = node && (node.kind === 'request' || node.kind === 'testFolder') ? node.data : undefined;
    const types = [APIS_TARGET_TYPE_ENUM.API, APIS_TARGET_TYPE_ENUM.SSE, APIS_TARGET_TYPE_ENUM.GRAPHQL, APIS_TARGET_TYPE_ENUM.WEBSOCKET, APIS_TARGET_TYPE_ENUM.SOCKETIO, APIS_TARGET_TYPE_ENUM.FOLDER];
    const type = await vscode.window.showQuickPick(types.map(type => ({ label: type === 'folder' ? (zh ? '目录' : 'Folder') : type.toUpperCase(), type })), { title: zh ? '新建' : 'New' });
    if (!type) { return; }
    const name = await vscode.window.showInputBox({ title: zh ? '名称' : 'Name', value: type.type === 'folder' ? (zh ? '新建目录' : 'New Folder') : (zh ? '新建接口' : 'New Request'), validateInput: value => value.trim() ? undefined : (zh ? '请输入名称' : 'Enter a name') });
    if (!name?.trim()) { return; }
    const data = { ...cloneDeep(APIS_BASE_DEFAULT_DATA[type.type]), target_type: type.type, target_id: snowflakeId(), name: name.trim(), parent_id: parent?.target_type === 'folder' ? parent.target_id : '0', is_create: 1, is_changed: 1, is_deleted: -1 } as ApiDetailsData;
    await handleMessage({ action: 'saveFolder', data }, context);
    if (type.type !== 'folder') { await vscode.commands.executeCommand('openTabPanel', data); }
    changed.fire(undefined);
  });
}
