import styles from "./style.module.css";
import { Flex } from "@/shared/ui/base";
import React, { lazy, useEffect } from "react";

import { useApis } from "@/app/store";
import { ApiDetailsData, ApisData } from "@/features/requests/types/api";
import SuspenseContent from "@/shared/components/SuspenseContent";

const ApiDebug = lazy(() => import("./api/Debug"));
const SseDebug = lazy(() => import("./sse/Debug"));
const Folder = lazy(() => import("./Folder"));
const Websocket2Debug = lazy(() => import("./websocket2/Debug"));
const SocketioDebug = lazy(() => import("./socketio/Debug"));
const GraphqlDebug = lazy(() => import("./graphql/Debug"));
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
          <SuspenseContent>
            {renderContainer()}
            {apisActiveData.target_id && <ContentReady />}
          </SuspenseContent>
        </Flex>
      }
    </>
  );
};

export default Content;
