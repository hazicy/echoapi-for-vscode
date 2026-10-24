import { globalConfig, LOCAL_PORT, PANEL_OPTIONS, socketIoStore, websocketStore } from '../constants';
import * as vscode from 'vscode';
import path from 'path';
import { getApiList, getHtmlForWebview, getCurrentProjectConfig, showTabName } from '../utils';
import { handelOpenMessage } from '../messageHandler/open';

export const createOpenPanel = (data: any, context: vscode.ExtensionContext) => {
  const { openedPanels, sidePanelWebView } = globalConfig;

  const panelOptions = PANEL_OPTIONS.OPEN;

  if (openedPanels[data?.target_id]) {
    // Tab already exists, switch to it
    openedPanels[data?.target_id].reveal(vscode.ViewColumn.One);
    return;
  }
  const afterText = data?.is_changed === 1 ? ' ⚈' : '';
  // Create and show panel
  const panel = vscode.window.createWebviewPanel(
    panelOptions.viewType,
    showTabName(data?.name || panelOptions.title) + afterText,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      // Enable popup window permission
      enableFindWidget: true,
      enableCommandUris: true,
    },
  );

  const iconName = panelOptions?.iconObj?.[data?.target_type] || "";
  panel.iconPath = vscode.Uri.file(
    path.join(context.extensionPath, "dist", "images", iconName)
  );
  let scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist', `${panelOptions.viewType}.js`)));
  if(process.env.ECHOAPI_DEV_SERVER === "true"){
    scriptUri = `http://localhost:${LOCAL_PORT}/src/app/webviews/${panelOptions.viewType[0].toUpperCase()}${panelOptions.viewType.slice(1)}.tsx`;
  }
  const resourceBaseUrl = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'dist')));

  // Store tab in list
  openedPanels[data?.target_id] = panel;


  // And set its HTML content
  panel.webview.html = getHtmlForWebview(scriptUri, resourceBaseUrl, null, true);

  // Initialize selected API id to sidebar
  sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setApisActiveKey', data: data?.target_id });

  // Receive messages from Webview
  panel.webview.onDidReceiveMessage(async (message: { action: string, data: any }) => {
    handelOpenMessage(message, context, panel, data);
  });

  // Listen for Webview view visibility changes
  panel.onDidChangeViewState(() => {
    if (panel.visible) {
      // Pass selected API id to sidebar after display
      sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setApisActiveKey', data: data?.target_id });

      // Get latest directory list
      panel?.webview.postMessage({ action: 'setApiList', data: getApiList(context) });

      // Get latest project data
      panel?.webview.postMessage({ action: 'setProjectConfig', data: getCurrentProjectConfig(context) });

    }
  });

  // Triggered when tab is closed
  panel.onDidDispose(
    () => {
      // When the panel is closed, cancel any future updates to the webview content
      delete openedPanels[data?.target_id];
      if (websocketStore?.[data?.target_id]) {
        websocketStore[data?.target_id]?.close(); //Close existing
        websocketStore[data?.target_id] = null;
        delete websocketStore[data?.target_id];
      }
      if (socketIoStore?.[data?.target_id]) {
        socketIoStore[data?.target_id]?.disconnect(); //Close existing
        socketIoStore[data?.target_id] = null;
        delete socketIoStore[data?.target_id];
      }
    },
    null,
    context.subscriptions
  );
}
