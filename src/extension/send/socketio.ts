import { globalConfig, socketIoStore } from "../constants";
import { SocketClient, SocketIoConnectionError } from "./socketioClient";
import { applySocketSettings } from "./socketSettings";
import * as vscode from "vscode";
import { SocketIoDetailsData } from "@/features/requests/types/socketio";
import {
  createTargetIdMap,
  getAboutCollections,
} from "@/features/requests/utils/send/utils";
import { SysConfig } from "@/features/settings/types/settings";
import {
  genSendBaseOptions,
  getApiList,
  getCurrentProjectConfig,
} from "../utils";
import { ProjectConfigType } from "@/features/project/types";
import { find, isEqual } from "lodash";

export const socketioDisconnect = (target_id: string) => {
  socketIoStore[target_id]?.disconnect();
};

export const socketioConnect = async (data: {
  option: any;
  target: SocketIoDetailsData;
}) => {
  const { target, option } = data;
  if (!target?.target_id) {
    return;
  }
  const id = target.target_id;
  socketIoStore[id]?.disconnect();
  const client = new SocketClient(target, option, (message) => {
    if (socketIoStore[id] !== client) {
      return;
    }
    globalConfig.openedPanels[id]?.webview.postMessage({
      action: "setSocketIoResult",
      data: { message, target_id: id, action: "received" },
    });
  });
  socketIoStore[id] = client;
  try {
    const wsResponse = await client.connect();
    if (socketIoStore[id] === client) {
      globalConfig.openedPanels[id]?.webview.postMessage({
        action: "setSocketIoResult",
        data: {
          message: wsResponse,
          target_id: id,
          action: "connected",
          target,
        },
      });
    }
    await client.awaitDisconnect();
  } catch (error: any) {
    if (socketIoStore[id] === client) {
      globalConfig.openedPanels[id]?.webview.postMessage({
        action: "setSocketIoResult",
        data: {
          message:
            error instanceof SocketIoConnectionError ? error.result : error,
          target_id: id,
          action: "error",
        },
      });
    }
  } finally {
    if (socketIoStore[id] === client) {
      delete socketIoStore[id];
    }
  }
};

export const socketioSend = async (data: {
  target_id: any;
  event: any;
  msg: any;
  is_ack: any;
  type: any;
}) => {
  try {
    const { target_id, event, msg, is_ack, type } = data;
    if (!target_id) {
      return;
    }

    if (!event) {
      return;
    }

    if (!socketIoStore?.[target_id]) {
      return;
    }

    const client = socketIoStore[target_id];
    if (!client?.emitEvent) {
      return;
    }

    if (is_ack === true || Number(is_ack) === 1) {
      await client.emitEventWithAck(event, msg, type);
    } else {
      await client.emitEvent(event, msg, type);
    }
  } catch (error) {}
};

export const socketioUpdateEvent = async (data: {
  target_id: any;
  parameter: any;
}) => {
  const { openedPanels } = globalConfig;
  try {
    const { target_id, parameter } = data;
    if (!target_id) {
      return;
    }

    if (!parameter) {
      return;
    }

    if (!socketIoStore[target_id]) {
      return;
    }

    const client = socketIoStore[target_id];
    if (!client?.updateEvent) {
      return;
    }

    const ret = client.updateEvent(parameter);

    if (openedPanels?.[target_id]) {
      openedPanels[target_id]?.webview.postMessage({
        action: "setSocketIoResult",
        data: {
          message: { ...ret, target_id: target_id },
          target_id: target_id,
          action: "updateEvent",
        },
      });
    }
  } catch (error) {}
};

export const getSocketIoOption = async (
  data: { option: any; target: any },
  context: vscode.ExtensionContext,
) => {
  const projectConfig = getCurrentProjectConfig(context) as ProjectConfigType;
  const apiList = getApiList(context);
  const { option, target } = data;
  const systemConfig =
    (context.globalState.get("systemConfig") as SysConfig) || {};
  // Parent directory related parameters
  const _collection = await getAboutCollections(
    target,
    apiList,
    systemConfig,
    false,
    option?.server_id,
  );

  const curEnv = find(projectConfig?.envList || [], (env) =>
    isEqual(env.env_id, projectConfig?.envDetailKeys),
  );

  // Create target_id mapping and remove extra fields
  const targetIdMap = createTargetIdMap(_collection, curEnv?.server_list);

  if (_collection) {
    for (let index = 0; index < _collection.length; index++) {
      const item = _collection[index];
      _collection[index] = targetIdMap.get(item.target_id) || item;
    }
  }
  const options = await genSendBaseOptions({
    scene: "http_request",
    collection: _collection,
    databaseConfigs: {},
    projectConfig,
    systemConfig,
    curServerId: option?.server_id,
    targetId: target?.target_id,
    type: target?.target_type,
  });
  return applySocketSettings(
    options,
    systemConfig,
    vscode.workspace.getConfiguration("http").get<string>("proxy", ""),
  );
};
