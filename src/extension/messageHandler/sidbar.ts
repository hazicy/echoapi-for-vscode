import * as vscode from "vscode";
import { storageChanged } from '../storageEvents';
import {
  deleteProjectReport,
  deleteTestingFoldersData,
  downloadFile,
  getAllApiChildren,
  getAllChildIds,
  getApiList,
  getMaxSort,
  getCurrentProjectConfig,
  getProjectReportList,
  getTestingFolderName,
  setApiList,
  setProjectApisVersion,
  setProjectConfig,
  openInFileExplorer,
  getApiListName,
} from "../utils";
import { globalConfig } from "../constants";
import {
  cloneDeep,
  forEach,
  isArray,
  isEmpty,
  isFunction,
  isPlainObject,
} from "lodash";
import { getCodeHarRequest, updateOpenData } from "../apis";
import { DEFAULT_TEAM } from "@/features/project/constants/team";
import { DEFAULT_PROJECT } from "@/features/project/constants/project";
import {
  createShare,
  deleteShare,
  getDocBaseUrl,
  getOpenApi,
  getProjectShareData,
  setProjectShareData,
} from "../utils/share";
import { snowflakeId } from "apipost-tools";
import { ApiDetailsData } from "@/features/requests/types/api";
import { getStorageFilePath } from "../db";

const persistApiList = (list: ApiDetailsData[], context: vscode.ExtensionContext) => {
  if (setApiList(list, context)) {
    return true;
  }
  vscode.window.showErrorMessage("Failed to save requests. Please try again.");
  return false;
};

const notifyApiListChanged = (apiList: ApiDetailsData[], context: vscode.ExtensionContext) => {
  const { sidePanelWebView, pushWebView, shareListWebView, openedFolderTestPanels } = globalConfig;
  // Update page
  sidePanelWebView?.webview.postMessage({
    action: "setApiList",
    data: apiList || [],
  });

  if (pushWebView) {
    pushWebView?.webview.postMessage({
      action: "setPushPanelData",
      data: {
        local_api_list: apiList,
      },
    });
  }

  if (shareListWebView) {
    shareListWebView?.webview.postMessage({
      action: "setApiList",
      data: apiList,
    });
  }

  // Update API list in run all
  if (
    isPlainObject(openedFolderTestPanels) &&
    !isEmpty(openedFolderTestPanels)
  ) {
    Object.keys(openedFolderTestPanels).forEach((folderName) => {
      let folder_id = folderName.split(":")[1];
      if (folder_id) {
        openedFolderTestPanels[folderName].webview.postMessage({
          action: "setTestData",
          data: {
            ventList: getAllApiChildren(folder_id, context), // API list under directory (flat)
          },
        });
      }
    });
  }
};

const saveApiListItem = (
  data: ApiDetailsData,
  context: vscode.ExtensionContext,
) => {
  const { openedPanels } = globalConfig;

  const apiList: any[] = getApiList(context);
  const index = apiList.findIndex((e: any) => e?.target_id === data?.target_id);
  if (index > -1) {
    apiList.splice(index, 1, data); // Replace target element
  } else {
    data.sort = getMaxSort(apiList, data.parent_id);
    apiList.push(data); // Add element
  }
  if (!persistApiList(apiList, context)) {
    return false;
  }
  if (index > -1) {
    updateOpenData(openedPanels, data);
    if (data.target_type === "folder") {
      const testPanel = globalConfig.openedFolderTestPanels[getTestingFolderName(data.target_id, context)];
      if (testPanel) {
        testPanel.title = data.name;
        testPanel.webview.postMessage({ action: "setTestData", data: { testingName: data.name } });
      }
    }
  }
  notifyApiListChanged(apiList, context);
  return true;
};

export const handleMessage = async (
  message: { action: string; data: any; option?: any },
  context: vscode.ExtensionContext,
) => {
  const apiList: any[] = getApiList(context);

  const {
    sidePanelWebView,
    openedPanels,
    openedFolderTestPanels,
    openedFolderTestReportDataPanels,
    pushWebView,
    shareListWebView,
  } = globalConfig;

  switch (message.action) {
    case "getApiList":
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setApiList",
          data: getApiList(context),
        });
      break;
    case "getUserConfig":
      let user_config: any = context.globalState.get("userConfig") || {};
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setUserConfig",
          data: {
            ...{
              currentTeam: DEFAULT_TEAM,
              currentProject: DEFAULT_PROJECT,
            },
            ...user_config,
          },
        });
      break;
    case "getSystemConfig":
      sidePanelWebView?.webview.postMessage({
        action: "setSystemConfig",
        data: context.globalState.get("systemConfig") || {},
      });
      break;
    case "getProjectConfig":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectConfig",
        data: getCurrentProjectConfig(context),
      });
      break;
    case "setApiList":
      if (!persistApiList(message.data, context)) {
        return false;
      }
      // Record project API versions for later conflict comparison
      setProjectApisVersion(context, message.data);
      // Update open data to latest
      forEach(globalConfig.openedPanels, (openedPanel, key) => {
        const openItem = message.data.find((i: any) => i?.target_id === key);
        if (isPlainObject(openItem)) {
          openedPanel.webview.postMessage({
            action: "setApiData",
            data: openItem,
          });
        }
      });

      if (pushWebView) {
        pushWebView?.webview.postMessage({
          action: "setPushPanelData",
          data: {
            local_api_list: message.data,
          },
        });
      }

      if (shareListWebView) {
        shareListWebView?.webview.postMessage({
          action: "setApiList",
          data: message.data,
        });
      }

      break;
    case "openTagPanel":
      vscode.commands.executeCommand("openTabPanel", message.data);
      break;
    case "openPushPanel":
      vscode.commands.executeCommand("echoapi.openPush", message.data);
      break;
    case "openCurlPanel":
      vscode.commands.executeCommand("openCurlPanel");
      break;
    case "openImportDataPanel":
      vscode.commands.executeCommand("openImportDataPanel", message.data);
      break;
    case "openExportDataPanel":
      vscode.commands.executeCommand("openExportDataPanel", message.data);
      break;
    case "setProjectConfig":
      // Local stored data collection
      const project_config = getCurrentProjectConfig(context);
      if (isPlainObject(message.data)) {
        forEach(message.data, (value, key) => {
          project_config[key] = value;
        });
      }
      setProjectConfig(context, project_config);
      break;
    case "switchProject":
      try {
        const { team, project } = message.data;
        if (!team || !project) {
          return;
        }

        // Clear open tabs
        forEach(openedPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Clear open automated test tabs
        forEach(openedFolderTestPanels, (openedPanel) => {
          openedPanel.dispose();
        });

        // Clear open report result tabs
        forEach(openedFolderTestReportDataPanels, (openedPanel) => {
          openedPanel.dispose();
        });


        // Close all tab pages
        forEach(globalConfig, (panel, key) => {
          if (isFunction(panel?.dispose) && key !== "sidePanelWebView") {
            panel.dispose();
          }
        });

        let new_user_config: any = context.globalState.get("userConfig") || {};
        // Update currently selected project
        new_user_config.currentTeam = team;
        new_user_config.currentProject = project;

        await context.globalState.update("userConfig", new_user_config);
        storageChanged.fire('userConfig');

        // Restore local apiList
        sidePanelWebView?.webview.postMessage({
          action: "setApiList",
          data: getApiList(context),
        });

        // Get project report list
        sidePanelWebView?.webview.postMessage({
          action: "setProjectReportList",
          data: getProjectReportList(context),
        });

        // Get project doc list
        sidePanelWebView?.webview.postMessage({
          action: "setProjectShareData",
          data: getProjectShareData(context),
        });

        // Get project configuration
        sidePanelWebView?.webview.postMessage({
          action: "setProjectConfig",
          data: getCurrentProjectConfig(context),
        });
      } catch (error) {}

      break;
    case "openTagPanelById":
      const curData = apiList.find(
        (i: ApiDetailsData) => i?.target_id === message.data,
      );
      if (!curData) {
        break;
      }
      curData.is_create = -1;
      curData.is_changed = -1;
      vscode.commands.executeCommand("openTabPanel", curData);
      break;
    case "createShare":
      createShare(message.data, context);
      // Refresh share list
      shareListWebView?.webview.postMessage({
        action: "setShareData",
        data: getProjectShareData(context),
      });
      break;
    case "showInputBox":
      const userInput = await vscode.window.showInputBox({
        prompt: message?.data?.prompt || "Folder Name",
        placeHolder: "",
        value: message?.data?.value || "",
      });

      // Send user input results back to Webview
      sidePanelWebView?.webview.postMessage({
        action: "inputResult",
        inputValue: userInput,
        data: {
          type: message?.data?.type || "folder",
          sourceData: message?.data?.sourceData,
        },
      });

      break;
    case "saveFolder":
      return saveApiListItem(message?.data, context);
    case "cloneApi":
      const target = apiList.find(
        (i) => i?.target_id === message.data.target_id,
      );
      if (target === undefined) {
        return;
      }
      const dataNew = cloneDeep(target);
      dataNew.target_id = snowflakeId();
      dataNew.version = 0;
      if (dataNew?.name === "") {
        dataNew.name = "Create";
      }
      dataNew.name += ` Copy`;

      if (saveApiListItem(dataNew, context)) {
        vscode.window.showInformationMessage("Duplicate Successfully");
      }

      break;
    case "showConfirmation":
      const projectKey = getApiListName(context);
      const result = await vscode.window.showInformationMessage(
        message.data.title,
        { modal: true },
        "Yes",
        "No",
      );
      if (result === "Yes") {
        if (getApiListName(context) !== projectKey) {
          return;
        }
        // Confirmation is asynchronous; preserve edits made while it was open.
        const currentList = getApiList(context);
        const curData = currentList.find(item => item.target_id === message.data.target_id);
        if (!curData) {
          return;
        }
        const deletedIds = new Set(curData.target_type === "folder"
          ? getAllChildIds(currentList, curData)
          : [curData.target_id]);
        const list = currentList.filter(item => !deletedIds.has(item.target_id));
        if (!persistApiList(list, context)) {
          return false;
        }
        for (const id of deletedIds) {
          openedPanels[id]?.dispose();
          if (curData.target_type === "folder") {
            const folderName = getTestingFolderName(id, context);
            openedFolderTestPanels[folderName]?.dispose();
          }
        }

        if (curData.target_type === "folder" && !deleteTestingFoldersData(deletedIds, context)) {
          vscode.window.showErrorMessage("Requests were deleted, but saved test data could not be cleaned up.");
        }
        notifyApiListChanged(list, context);
      }
      break;
    case "onDrop":
      // Find all elements under the moved directory
      if (isArray(message?.data?.target_ids)) {
        const changedItems = new Map<string, ApiDetailsData>();
        forEach(message.data.target_ids, (target_id) => {
          const moved = apiList.find(item => item.target_id === target_id);
          if (!moved) {
            return;
          }
          const parentId = message.data.parent_id || "0";
          const { after_target_id: after, before_target_id: before } = message.data;
          if (after === "0" && before === "0") {
            moved.parent_id = parentId;
            moved.sort = getMaxSort(apiList, parentId);
          } else {
            const insertAfter = after === "0" && before !== "0";
            const insertBefore = after !== "0" && before === "0";
            if (!insertAfter && !insertBefore) {
              return;
            }
            const siblings = apiList
              .filter(item => item.parent_id === parentId && item.target_id !== target_id)
              .sort((a, b) => a.sort - b.sort);
            const goalIndex = siblings.findIndex(item => item.target_id === (insertAfter ? before : after));
            if (goalIndex < 0) {
              return;
            }
            moved.parent_id = parentId;
            siblings.splice(goalIndex + (insertAfter ? 1 : 0), 0, moved);
            siblings.forEach((item, index) => {
              item.sort = index + 1;
              changedItems.set(item.target_id, item);
            });
          }
          changedItems.set(moved.target_id, moved);
        });
        if (changedItems.size === 0) {
          return;
        }
        if (!persistApiList(apiList, context)) {
          return false;
        }
        changedItems.forEach(item => updateOpenData(openedPanels, item));
        notifyApiListChanged(apiList, context);

        vscode.window.showInformationMessage("Move Success");
      }
      break;
    case "runFolder":
      // Open folderTest page
      vscode.commands.executeCommand(
        "echoapi.folderTest",
        message.data,
        message.option,
      );
      break;
    case "openReportData":
      // Open fReportData page
      vscode.commands.executeCommand(
        "echoapi.folderTestReportData",
        message.data,
      );
      break;
    case "getProjectReportList":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectReportList",
        data: getProjectReportList(context),
      });
      break;
    case "deleteReport":
      if (deleteProjectReport(message?.data?.report_id, context)) {
        vscode.window.showInformationMessage("Delete Success");
        // Close already open tabs
        if (openedFolderTestReportDataPanels[message?.data?.report_id]) {
          openedFolderTestReportDataPanels[message?.data?.report_id].dispose();
        }
        // Refresh page after deletion
        sidePanelWebView?.webview.postMessage({
          action: "setProjectReportList",
          data: getProjectReportList(context),
        });
      }
      break;
    case "openNewWindow":
      vscode.env.openExternal(vscode.Uri.parse(message.data));
      break;
    case "getProjectShareData":
      sidePanelWebView?.webview.postMessage({
        action: "setProjectShareData",
        data: getProjectShareData(context),
      });
      break;
    case "deleteShare":
      deleteShare(message.data, context);


      // Refresh share list
      // sidePanelWebView && sidePanelWebView.webview.postMessage({ action: 'setProjectShareData', data: getProjectShareData(context) });
      break;
    case "openDocPanel":
      vscode.commands.executeCommand("echoapi.docsShareData", message.data);
      break;
    case "getDocBaseUrl":
      sidePanelWebView &&
        sidePanelWebView.webview.postMessage({
          action: "setDocBaseUrl",
          data: getDocBaseUrl(context),
        });
      break;
    case "exportOpenApiById":
      const openData = apiList.find(
        (i) => i?.target_id === message?.data?.target_id,
      );
      if (openData !== undefined) {
        const fileObj = await getOpenApi(openData, context);
        if (fileObj === null) {
          return;
        }
        await downloadFile(fileObj.fileName, fileObj.openApiStr);
      }
      break;
    case "updateShareTime":
      if (isArray(message.data)) {
        const shareData = getProjectShareData(context);
        forEach(message.data, (id) => {
          // Check if share record exists, update share time if so
          if (shareData?.[id]) {
            shareData[id].share_time = Date.now();
          }
          setProjectShareData(shareData, context);
          // Refresh share list
          shareListWebView?.webview.postMessage({
            action: "setShareData",
            data: shareData,
          });
        });
      }
      break;
    case "copyAsCurl":
      // Fix: cannot carry global parameters under directory (temporarily modify directory id)
      if (message?.data?.apiData?.parent_id) {
        message.data.apiData.parent_id = "0";
      }
      const har = await getCodeHarRequest(message.data.apiData, context);
      // Send HAR request results back to Webview
      sidePanelWebView?.webview.postMessage({
        action: "copyAsCurl",
        data: har,
      });

      // vscode.window.showInformationMessage('Copy Success');
      break;
    case "openeShareListPanel":
      vscode.commands.executeCommand("echoapi.shareList", message.data);
      break;
    case "getVscodeTheme":
      const vscodeTheme = vscode.workspace
        .getConfiguration("workbench")
        .get("colorTheme");
      sidePanelWebView?.webview.postMessage({
        action: "setVscodeTheme",
        data: vscodeTheme,
      });
      break;
    case "openVscodeFileExplorer":
      openInFileExplorer(getStorageFilePath(context, getApiListName(context)));

      break;
  }
};
