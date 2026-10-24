import styles from "./style.module.css";
import { Flex } from "@/shared/ui/base";
import React, { lazy, useEffect } from "react";

import { useApis } from "@/app/store";
import { ApiDetailsData, ApisData } from "@/features/requests/types/api";
const protocolLoaders = {
  api: () => import("./api/Debug"),
  sse: () => import("./sse/Debug"),
  folder: () => import("./Folder"),
  websocket2: () => import("./websocket2/Debug"),
  socketio: () => import("./socketio/Debug"),
  graphql: () => import("./graphql/Debug"),
};
export function preloadRequestProtocol(type: string) {
  const load = protocolLoaders[type as keyof typeof protocolLoaders];
  // Prefetch is optional; React.lazy still reports a real load failure.
  if (load) {
    void load().catch(() => {});
  }
}
const ApiDebug = lazy(protocolLoaders.api);
const SseDebug = lazy(protocolLoaders.sse);
const Folder = lazy(protocolLoaders.folder);
const Websocket2Debug = lazy(protocolLoaders.websocket2);
const SocketioDebug = lazy(protocolLoaders.socketio);
const GraphqlDebug = lazy(protocolLoaders.graphql);
if (window.vscodeData?.target_type) {
  preloadRequestProtocol(window.vscodeData.target_type);
}
import { APIS_TARGET_TYPE_ENUM } from "@/features/requests/constants";
import { Websocket2DetailsData } from "@/features/requests/types/websocket2";
import { SocketIoDetailsData } from "@/features/requests/types/socketio";
import { GraphQLDetailsData } from "@/features/requests/types/graphql";

interface ContentProps {
  value?: ApiDetailsData;
  curApiSendingData?: any;
}

// Inside the Suspense boundary: runs after the selected protocol has committed.
function ContentReady() {
  useEffect(() => {
    performance.mark("okapi:content-ready");
    if (performance.getEntriesByName("okapi:data-ready").length) {
      performance.measure(
        "okapi:data-to-content",
        "okapi:data-ready",
        "okapi:content-ready",
      );
    }
    if (performance.getEntriesByName("okapi:html-ready").length) {
      performance.measure(
        "okapi:html-to-content",
        "okapi:html-ready",
        "okapi:content-ready",
      );
    }
    let secondFrame = 0;
    // Load the collection only after the selected protocol has committed and painted.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        window.vscode.postMessage({ action: "getApiList" });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);
  return null;
}

const Content: React.FC<ContentProps> = () => {
  const apisActiveData: Partial<ApisData> = useApis(
    (store) => store.apisActiveData,
  );
  const updateApisActiveData = useApis((store) => store.updateApisActiveData);

  const onApisDataChange = (newData: ApiDetailsData) => {
    window?.vscode.postMessage({
      action: "updateApiActiveData",
      data: newData,
    });
    updateApisActiveData(newData);
  };

  const renderContainer = () => {
    if (apisActiveData.target_type === "api") {
      return (
        <ApiDebug
          apisData={apisActiveData as ApiDetailsData}
          onApisDataChange={onApisDataChange}
        />
      );
    }
    if (apisActiveData.target_type === "sse") {
      return (
        <SseDebug
          apisData={apisActiveData as ApiDetailsData}
          onApisDataChange={onApisDataChange}
        />
      );
    }
    if (apisActiveData.target_type === APIS_TARGET_TYPE_ENUM.FOLDER) {
      return (
        <Folder
          apisData={apisActiveData as ApiDetailsData}
          onApisDataChange={onApisDataChange}
        />
      );
    }
    if (apisActiveData.target_type === "websocket2") {
      return (
        <Websocket2Debug
          apisData={apisActiveData as Websocket2DetailsData}
          onApisDataChange={(val) => {
            onApisDataChange(val as unknown as ApiDetailsData);
          }}
        />
      );
    }
    if (apisActiveData.target_type === "socketio") {
      return (
        <SocketioDebug
          apisData={apisActiveData as SocketIoDetailsData}
          onApisDataChange={(val) => {
            onApisDataChange(val as unknown as ApiDetailsData);
          }}
        />
      );
    }
    if (apisActiveData.target_type === "graphql") {
      return (
        <GraphqlDebug
          apisData={apisActiveData as GraphQLDetailsData}
          onApisDataChange={(val) => {
            onApisDataChange(val as unknown as ApiDetailsData);
          }}
        />
      );
    }
    return <></>;
  };

  return (
    <>
      {
        <Flex vertical className={styles.apiDebug}>
          {renderContainer()}
          {apisActiveData.target_id && <ContentReady />}
        </Flex>
      }
    </>
  );
};

export default Content;
