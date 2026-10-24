import { setRequestDraft } from "../requestStatus";
import { getApiListName } from "../utils";
import { getProtocolIcon } from "../protocolIcon";
import * as vscode from "vscode";
import { recordRequestHistory } from "../requestHistory";
import {
  downloadFile,
  getApiList,
  getCurrentEnvCurrentServer,
  getMaxSort,
  getCurrentProjectConfig,
  setApiList,
  setProjectConfig,
  showTabName,
} from "../utils";
import { getCodeHarRequest, sendApi, sendSse, stopWorker } from "../apis";
import { globalConfig, DEFAULT_TARGET_NAME } from "../constants";
import { cloneDeep, forEach, isPlainObject, trim } from "lodash";
import {
  createShare,
  getDocBaseUrl,
  getOpenApi,
  getProjectShareData,
  setProjectShareData,
} from "../utils/share";
import { ApiDetailsData } from "@/features/requests/types/api";
import {
  getWebsocketOption,
  wsConnect,
  wsDisconnect,
  wsSend,
} from "../send/websocket";
import {
  getSocketIoOption,
  socketioConnect,
  socketioDisconnect,
  socketioSend,
  socketioUpdateEvent,
} from "../send/socketio";
import { proxyFetch, proxyFetch2 } from "../utils/fetch";

const saveApiData = (
  data: any,
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  automatic = false,
) => {
  const { sidePanelWebView } = globalConfig;
  const apiList: ApiDetailsData[] = getApiList(context);
  // Local stored data collection
  const newData: ApiDetailsData = cloneDeep(data);
  const index = apiList.findIndex((e) => e?.target_id === newData?.target_id);
  newData.is_create = -1;
  newData.is_changed = -1;
  if (trim(newData?.name).length <= 0) {
    newData.name =
      DEFAULT_TARGET_NAME?.[newData?.target_type] || "HTTP Request";
  }
  if (index > -1) {
    apiList.splice(index, 1, newData); // Replace element
  } else {
    newData.sort = getMaxSort(apiList, newData.parent_id);
    apiList.push(newData); // Add element
  }
  if (!setApiList(apiList, context)) {
    if (automatic) {
      setRequestDraft(getApiListName(context), data.target_id, cloneDeep(data));
      panel.title = showTabName(data?.name) + " ⚈";
    }
    vscode.window.showErrorMessage(
      "Failed to save requests. Please try again.",
    );
    return false;
  }
  setRequestDraft(getApiListName(context), newData.target_id);
  // Save and update open
  // Automatic saves must not replace newer edits already in the Webview.
  if (!automatic) {
    panel.webview.postMessage({ action: "setApiData", data: newData });
  }

  // Update title
  panel.title = showTabName(newData?.name);
  const protocolIcon = getProtocolIcon(context, newData);
  if (protocolIcon) panel.iconPath = protocolIcon;

  // Update left sidebar directory
  sidePanelWebView &&
    sidePanelWebView.webview.postMessage({
      action: "setApiList",
      data: apiList || [],
    });

  // Check if share record exists, update share time if so
  const shareData = getProjectShareData(context);
  if (shareData?.[newData.target_id]) {
    shareData[newData.target_id].share_time = Date.now();
    setProjectShareData(shareData, context);
    // Refresh share list
    sidePanelWebView &&
      sidePanelWebView.webview.postMessage({
        action: "setProjectShareData",
        data: shareData,
      });
  }

  if (!automatic) {
    vscode.window.showInformationMessage("Save Successfully！🎉");
  }
};

export const handelOpenMessage = async (
  message: { action: string; data: any; option?: any },
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  apiData: ApiDetailsData,
) => {
  const { sidePanelWebView, environmentWebView } = globalConfig;
  const { action, data } = message;

  switch (action) {
    case "getVscodeTheme":
      const vscodeTheme = vscode.workspace
        .getConfiguration("workbench")
        .get("colorTheme");
      panel?.webview.postMessage({
        action: "setVscodeTheme",
        data: vscodeTheme,
      });
      break;
    case "getApiList":
      panel?.webview.postMessage({
        action: "setApiList",
        data: getApiList(context),
      });
      break;
    case "saveApiData":
      saveApiData(data, context, panel);
      break;
    case "updateApiActiveData":
      if (data.target_type === "api") {
        saveApiData(data, context, panel, true);
        break;
      }
      setRequestDraft(getApiListName(context), data.target_id, cloneDeep(data));
      // Update title
      panel.title = showTabName(data?.name) + " ⚈";
      const activeProtocolIcon = getProtocolIcon(context, data);
      if (activeProtocolIcon) panel.iconPath = activeProtocolIcon;
      break;
    case "sendApi":
      recordRequestHistory(context, data);
      // Get global parameters
      const result = await sendApi(
        data,
        context,
        environmentWebView,
        message?.option,
      );
      // Send request results back to Webview
      panel.webview.postMessage({
        action: "apiSendResult",
        data: JSON.stringify(result),
      });
      break;
    case "sendSse":
      recordRequestHistory(context, data);
      sendSse(
        data,
        context,
        environmentWebView,
        (vl: any) => {
          // Send request results back to Webview
          panel.webview.postMessage({ action: "sseSendResult", data: vl });
        },
        message?.option,
      );

      break;
    case "stopSendApi":
      stopWorker();
      break;
    case "openNewWindow":
      vscode.env.openExternal(vscode.Uri.parse(data));
      break;
    case "openEnv":
      vscode.commands.executeCommand("echoapi.openEnv", data);
      break;
    case "openTagPanelById":
      const curData = getApiList(context).find(
        (i: ApiDetailsData) => i?.target_id === message.data,
      );
      if (!curData) {
        break;
      }
      curData.is_create = -1;
      vscode.commands.executeCommand("openTabPanel", curData);
      break;
    case "getProjectConfig":
      panel.webview.postMessage({
        action: "setProjectConfig",
        data: getCurrentProjectConfig(context),
      });
      break;
    case "setProjectConfig":
      const { key, value } = data;
      // Local stored data collection
      let project_config: any = getCurrentProjectConfig(context);
      project_config[key] = value;
      setProjectConfig(context, project_config);
      break;
    case "closeOpenTag":
      panel.dispose();
      break;
    case "getSystemConfig":
      let local_system_config: any =
        context.globalState.get("systemConfig") || {};
      panel.webview.postMessage({
        action: "setSystemConfig",
        data: local_system_config,
      });
      break;
    case "setSystemConfig":
      // Local stored data collection
      let default_system_config: any =
        context.globalState.get("systemConfig") || {};
      if (isPlainObject(data)) {
        forEach(data, (value, key) => {
          default_system_config[key] = value;
        });
      }

      context.globalState.update("systemConfig", default_system_config);

      // Notify other open tabs
      forEach(globalConfig.openedPanels, (openedPanel, key) => {
        openedPanel.webview.postMessage({
          action: "setSystemConfig",
          data: default_system_config || {},
        });
      });

      break;
    case "createShare":
      createShare(data, context);
      // Refresh share list
      sidePanelWebView?.webview.postMessage({
        action: "setProjectShareData",
        data: getProjectShareData(context),
      });
      break;
    case "getApiData":
      panel.webview.postMessage({ action: "setApiData", data: apiData });
      break;
    case "getDocBaseUrl":
      panel &&
        panel.webview.postMessage({
          action: "setDocBaseUrl",
          data: getDocBaseUrl(context),
        });
      break;
    case "exportOpenApiById":
      const localApiList: ApiDetailsData[] = getApiList(context);
      const openData = localApiList.find(
        (i) => i?.target_id === data?.target_id,
      );
      if (openData !== undefined) {
        const fileObj = await getOpenApi(openData, context);
        if (fileObj === null) {
          return;
        }
        await downloadFile(fileObj.fileName, fileObj.openApiStr);
      }
      break;
    case "getCodeHar":
      // Fix: cannot carry global parameters under directory (temporarily modify directory id)
      if (data.apiData?.parent_id) {
        data.apiData.parent_id = "0";
      }
      const codeHar = await getCodeHarRequest(
        data.apiData,
        context,
        message?.option,
      );
      // Send HAR request results back to Webview
      panel.webview.postMessage({ action: "setCodeHar", data: codeHar });
      break;
    case "copyAsCurl":
      // Fix: cannot carry global parameters under directory (temporarily modify directory id)
      if (data.apiData?.parent_id) {
        data.apiData.parent_id = "0";
      }
      const har = await getCodeHarRequest(
        data.apiData,
        context,
        message?.option,
      );
      // Send HAR request results back to Webview
      panel.webview.postMessage({ action: "copyAsCurl", data: har });
      break;
    case "ws_connect":
      recordRequestHistory(context, data);
      data.option = await getWebsocketOption(data, context);

      wsConnect(data);
      break;
    case "ws_disconnect":
      wsDisconnect(data);
      break;
    case "ws_send":
      wsSend(data);
      break;
    case "socketio_connect":
      recordRequestHistory(context, data);
      data.option = await getSocketIoOption(data, context);

      socketioConnect(data);
      break;
    case "socketio_disconnect":
      socketioDisconnect(data);
      break;
    case "socketio_send":
      socketioSend(data);
      break;
    case "socketio_update_event":
      socketioUpdateEvent(data);
      break;
    case "/proxy/fetch":
      proxyFetch(data, panel);
      break;
    case "getGraphQLSchema":
      const server = getCurrentEnvCurrentServer(context, data?.currentServerId);
      if (!data?.apiData.url && !server?.uri) {
        panel.webview.postMessage({
          action: "graphQLSchemaFetchResult",
          data: {
            code: 200,
            error: "Enter the server URL to retrieve the GraphQL Schema",
          },
        });
        return;
      }

      // Get real URL
      const harObj: any = await getCodeHarRequest(data?.apiData, context, {
        server_id: data?.currentServerId,
      });
      const url =
        harObj?.log?.entries?.[0]?.request?.url?.split("#")?.[0] || "";
      if (!url) {
        panel.webview.postMessage({
          action: "graphQLSchemaFetchResult",
          data: {
            code: 200,
            error: "Enter the server URL to retrieve the GraphQL Schema",
          },
        });
        return;
      }

      // Send cross-origin request
      const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args {
              ...InputValue
            }
          }
        }
      }
  
      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
  
      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
      }
  
      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

      const param = {
        url: url,
        headers: { "Content-Type": "application/json" },
        data: { query: introspectionQuery },
      };

      const res = await proxyFetch2(param);
      panel.webview.postMessage({
        action: "graphQLSchemaFetchResult",
        data: res,
      });
      break;
  }
};
