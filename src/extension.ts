import * as vscode from 'vscode';
import '@/shared/locale';
import {
  MySidebarView,
  createOpenPanel,
  createCurlPanel,
  createImportDataPanel,
  createEnvironmentPanel,
  createPushPanel,
  createFolderTestPanel,
  createfolderTestReportDataPanel,
  createExportDataPanel
} from '@/extension/panelManager';
import { onThemeChange, onFontSizeChange } from '@/extension/theme';
import { initializePlugin } from '@/extension/init';
import { restartServer, startDocsServer } from '@/extension/swaggerUi';
import { createShareListPanel } from './extension/panelManager/shareList';
import { isNumber } from 'lodash';
import { globalConfig } from '@/extension/constants';
import { handleMessage } from '@/extension/messageHandler/sidbar';
import { DEFAULT_PROJECT, DEFAULT_TEAM_PROJECT } from '@/features/project/constants/project';
import { Project, TeamItem } from '@/features/auth/types';
import { randomUUID } from 'node:crypto';
import { registerNativeTree } from './extension/nativeTree';
import { nativeTreeChanged } from './extension/nativeTreeEvents';

export async function activate(context: vscode.ExtensionContext) {

  // Code to execute during plugin initialization
  await initializePlugin(context);
  registerNativeTree(context);

 // Read user's saved enableFeature configuration value
 const config = vscode.workspace.getConfiguration('echoapi');
 const documentServicePort = config.get<number>('documentServicePort', 3000);

  // Start local document sharing service
  startDocsServer(context, documentServicePort);

  vscode.workspace.onDidChangeConfiguration(event => {
    // Monitor theme changes
    if (event.affectsConfiguration('workbench.colorTheme')) {
      onThemeChange();
    }
    // Monitor font size changes
    if (event.affectsConfiguration('editor.fontSize') || event.affectsConfiguration('editor.fontFamily')) {
      onFontSizeChange(context);
    }
    // Monitor document service port changes
    if (event.affectsConfiguration('echoapi.documentServicePort')) {
      const newConfig = vscode.workspace.getConfiguration('echoapi');
      const newdocumentServicePort = newConfig.get<number>('documentServicePort', 3000);
      if(isNumber(newdocumentServicePort)){
        restartServer(context, newdocumentServicePort);
      }
    }
  });

  // Register sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('myView', new MySidebarView(context), {
      webviewOptions: {
        retainContextWhenHidden: true
      },
    })
  );

  // Register editor Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.switchWorkspace', async () => {
      const userConfig = context.globalState.get<any>('userConfig') || {};
      const zh = vscode.env.language.startsWith('zh');
      const teams: TeamItem[] = [DEFAULT_TEAM_PROJECT, ...(userConfig.teamProjectList || [])];
      const items: (vscode.QuickPickItem & { team?: TeamItem; project?: Project })[] = teams.flatMap(team => (team.project || []).map(project => ({
        label: project.name,
        description: team.name,
        picked: project.project_id === userConfig.currentProject?.project_id,
        team,
        project,
      })));
      items.unshift({ label: zh ? '$(add) 新建工作区…' : '$(add) New Workspace…' });
      let selected = await vscode.window.showQuickPick(items, {
        title: zh ? '切换 Okapi 工作区' : 'Switch Okapi Workspace',
        matchOnDescription: true,
      });
      if (!selected) return;
      if (!selected.project) {
        const name = await vscode.window.showInputBox({
          title: zh ? '新建 Okapi 工作区' : 'New Okapi Workspace',
          prompt: zh ? '输入工作区名称' : 'Enter a workspace name',
          ignoreFocusOut: true,
          validateInput: value => {
            if (!value.trim()) return zh ? '请输入工作区名称' : 'Enter a workspace name';
            if (items.some(item => item.project?.name.toLowerCase() === value.trim().toLowerCase())) {
              return zh ? '工作区名称已存在' : 'A workspace with this name already exists';
            }
            return undefined;
          },
        });
        if (!name?.trim()) return;
        const project: Project = {
          ...DEFAULT_PROJECT,
          project_id: randomUUID(),
          team_id: DEFAULT_TEAM_PROJECT.team_id,
          name: name.trim(),
          is_default: 0,
          created_at: new Date(),
          edited_at: new Date(),
        };
        const team: TeamItem = { ...DEFAULT_TEAM_PROJECT, project: [project] };
        const teamProjectList: TeamItem[] = [...(userConfig.teamProjectList || [])];
        const existingTeam = teamProjectList.find(item => item.team_id === team.team_id);
        if (existingTeam) existingTeam.project = [...(existingTeam.project || []), project];
        else teamProjectList.push(team);
        await context.globalState.update('userConfig', { ...userConfig, teamProjectList });
        selected = { label: project.name, team: existingTeam || team, project };
      }
      if (selected.project?.project_id === userConfig.currentProject?.project_id) return;
      await handleMessage({ action: 'switchProject', data: selected }, context);
      nativeTreeChanged.fire();
      await globalConfig.sidePanelWebView?.webview.postMessage({
        action: 'setUserConfig',
        data: context.globalState.get('userConfig'),
      });
    })
  );

  // Register editor Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('openTabPanel', (data) => {
      createOpenPanel(data, context);
    })
  );

  // Register curl import Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('openCurlPanel', (data) => {
      createCurlPanel(data, context);
    })
  );

  // Register Import Data Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('openImportDataPanel', (data) => {
      createImportDataPanel(data ?? { type: 'curl' }, context);
    })
  );

  // Register Export Data Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('openExportDataPanel', (data) => {
      createExportDataPanel(data ?? { type: 'echoapi' }, context);
    })
  );

  // Register global environment Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.openEnv', (data) => {
      createEnvironmentPanel(data, context);
    })
  );

  // Register push page Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.openPush', (data) => {
      createPushPanel(data, context);
    })
  );


  // Share list page
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.shareList', (data) => {
      createShareListPanel(data, context);
    })
  );

  // Folder test page
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.folderTest', (data, option) => {
      createFolderTestPanel(data, context, option);
    })
  );

  // Folder test page
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.folderTestReportData', (data) => {
      createfolderTestReportDataPanel(data, context);
    })
  );

  // Feedback
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.feedBack', (data) => {
      vscode.env.openExternal(vscode.Uri.parse('https://github.com/hazicy/echoapi-for-vscode/issues'));
    })
  );

 // Help documentation
 context.subscriptions.push(
  vscode.commands.registerCommand('echoapi.openHelpDoc', (data) => {
    vscode.env.openExternal(vscode.Uri.parse('https://www.echoapi.com/wiki/docs/start/'));
  })
);

  // Contact us
  context.subscriptions.push(
    vscode.commands.registerCommand('echoapi.openExtenisonSettings', (data) => {
       // Jump directly to plugin settings page
       vscode.commands.executeCommand(
        'workbench.action.openSettings',
        `@ext:${context.extension.id}`
      );
      // vscode.env.openExternal(vscode.Uri.parse('https://x.com/EchoApiTeam'));
    })
  );

}

// This method is called when your extension is deactivated
export function deactivate() { };
