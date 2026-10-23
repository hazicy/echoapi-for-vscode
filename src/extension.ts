import * as vscode from 'vscode';
import '@/locale';
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

export async function activate(context: vscode.ExtensionContext) {

  // Code to execute during plugin initialization
  await initializePlugin(context);

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
      createImportDataPanel(data, context);
    })
  );

  // Register Export Data Webview
  context.subscriptions.push(
    vscode.commands.registerCommand('openExportDataPanel', (data) => {
      createExportDataPanel(data, context);
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
