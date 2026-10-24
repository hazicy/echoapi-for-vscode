import { Websocket2DetailsData } from "@/features/requests/types/websocket2";
import { globalConfig, websocketStore } from "../constants";
import { WSClient, WebSocketConnectionError } from "./websocketClient";
import * as vscode from "vscode";
import { ProjectConfigType } from "@/features/project/types";
import {
  genSendBaseOptions,
  getApiList,
  getCurrentProjectConfig,
} from "../utils";
import { getAboutCollections } from "@/features/requests/utils/send/utils";
import { SysConfig } from "@/features/settings/types/settings";

export const wsDisconnect = (target_id: string) => {
  websocketStore[target_id]?.close();
};

export const wsConnect = async (data: {
  option: any;
  target: Websocket2DetailsData;
}) => {
  const { target, option } = data;
  if (!target?.target_id) {
    return;
  }
  const id = target.target_id;
  const previous = websocketStore[id];
  previous?.close();
  const client = new WSClient(target, option, (message) => {
    // A stale connection must not change the state of its replacement.
    if (websocketStore[id] !== client) {
      return;
    }
    globalConfig.openedPanels[id]?.webview.postMessage({
      action: "setWsResult",
      data: { message, target_id: id, action: "received" },
    });
  });
  websocketStore[id] = client;
  try {
    const wsResponse = await client.connect();
    if (websocketStore[id] === client) {
      globalConfig.openedPanels[id]?.webview.postMessage({
        action: "setWsResult",
        data: { message: wsResponse, target_id: id, action: "connected" },
      });
    }
    await client.wait();
  } catch (error: any) {
    if (websocketStore[id] === client) {
      globalConfig.openedPanels[id]?.webview.postMessage({
        action: "setWsResult",
        data: {
          message:
            error instanceof WebSocketConnectionError ? error.result : error,
          target_id: id,
          action: "error",
        },
      });
    }
  } finally {
    if (websocketStore[id] === client) {
      delete websocketStore[id];
    }
  }
};

export const wsSend = async (data: {
  target_id: string;
  msg?: unknown;
  type?: string;
}) => {
  try {
    const { target_id } = data;
    if (!target_id) {
      return;
    }

    if (!websocketStore[target_id]) {
      return;
    }

    const client = websocketStore[target_id];
    if (!client?.send) {
      return;
    }
    await client.send(data);
  } catch (error) {}
};

export const getWebsocketOption = async (
  data: { option: any; target: any },
  context: vscode.ExtensionContext,
) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const apiList = getApiList(context);
  const { option, target } = data;
  const systemConfig =
    (context.globalState.get("systemConfig") as SysConfig) || {};

  const envDetailKeys = projectConfig?.envDetailKeys;

  // Parent directory related parameters
  const _collection = await getAboutCollections(
    target,
    apiList,
    systemConfig,
    false,
    option?.server_id,
  );

  const options = await genSendBaseOptions({
    envId: envDetailKeys,
    scene: "http_request",
    collection: _collection,
    curServerId: option?.server_id,
    projectConfig,
    systemConfig,
    targetId: target?.target_id,
    type: target?.target_type,
  });

  return {
    ...options,
    language: systemConfig.language,
    systemProxy: vscode.workspace
      .getConfiguration("http")
      .get<string>("proxy", ""),
    system_configs: {
      ...options.system_configs,
      proxy: {
        type: systemConfig.proxy === 3 ? 1 : systemConfig.proxy === 1 ? -1 : 2,
        envfirst: systemConfig.request_proxy_sys_open,
        bypass: systemConfig.request_proxy_bypass,
        protocols: systemConfig.request_proxy_type,
        auth: {
          host: `${systemConfig.request_proxy_url || ""}${systemConfig.request_proxy_port ? `:${systemConfig.request_proxy_port}` : ""}`,
          authenticate: systemConfig.request_proxy_auth_open,
          username:
            systemConfig.request_proxy_auth?.request_proxy_auth_username,
          password:
            systemConfig.request_proxy_auth?.request_proxy_auth_password,
        },
      },
      ca_cert: {
        open: systemConfig.ca_certificate?.open,
        path: systemConfig.ca_certificate?.file_url,
        base64: systemConfig.ca_certificate?.file_base64,
      },
      client_cert: systemConfig.client_certificate,
    },
  };
};
