import { getPopupContainer } from "@/shared/utils/popupContainer";
import { Suspense, use, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { App as AntdApp, ConfigProvider, Skeleton } from "@/shared/ui/base";
import useGlobalTheme from "@/shared/theme";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import antdLocale from "@/shared/locale/antd";

import "@/shared/assets/css/reset.css";

import "@/shared/locale";
import Content, {
  preloadRequestProtocol,
} from "@/features/requests/components/Content";
import { ThemeProvider } from "@/shared/ui/base/Theme";
import GlobalThemeStyle from "../../shared/theme/global";
import GlobalStyle from "../../shared/theme/globalStyle";

import {
  useApis,
  useGlobal,
  useProjectConfig,
  useSystemConfig,
} from "@/app/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HotkeysProvider } from "react-hotkeys-hook";
import useApisHotkeys from "@/features/requests/hooks/useHotKeys/useApisHotkeys";
import { forEach, keys } from "lodash";
import produce from "immer";
import {
  ApiSendingDataSSE,
  ApiStreamResponseSSEItem,
} from "@/features/requests/types/send";
import useShare from "@/features/sharing/store/useShare";
import { ApiDetailsData } from "@/features/requests/types/api";
import useWebsocket2 from "@/features/requests/components/Content/websocket2/useWebsocket2";
import useSocketIo from "@/features/requests/components/Content/socketio/useWebsocket2";
import useGraphQLQuery from "@/features/requests/components/GraphQLQuery/hooks";

let resolveInitialData: () => void;
const initialDataReady = new Promise<void>((resolve) => {
  resolveInitialData = resolve;
});

function InitializedContent({ loading }: { loading: boolean }) {
  if (loading) {
    use(initialDataReady);
  }
  return <Content />;
}

function TagPanel() {
  const customTheme = useGlobalTheme();

  const updateCurrentSendingData = useApis(
    (store) => store.updateCurrentSendingData,
  );
  const updateCurrentSseSendingData = useApis(
    (store) => store.updateCurrentSseSendingData,
  );
  const updateProjectConfig = useProjectConfig(
    (state) => state.updateProjectConfig,
  );
  const updateApisActiveData = useApis((store) => store.updateApisActiveData);
  const updateApiCodeHar = useApis((store) => store.updateApiCodeHar);
  const updateVscodeTheme = useGlobal((store) => store.updateVscodeTheme);
  const systemConfig = useSystemConfig((state) => state.systemConfig);
  const updateSystemConfig = useSystemConfig(
    (state) => state.updateSystemConfig,
  );
  const updateDocBaseUrl = useShare((state) => state.updateDocBaseUrl);
  const updateApiOriginDetailsList = useApis(
    (store) => store.updateApiOriginDetailsList,
  );
  const updateAllApiDetailsData = useApis(
    (store) => store.updateAllApiDetailsData,
  );
  const updateApisActiveKey = useApis((state) => state.updateApisActiveKey);

  const [lodaing, setLodaing] = useState(true);

  useApisHotkeys();

  const { handelWsResult } = useWebsocket2();

  const { handelSocketIoResult, handleProxyFetchResult } = useSocketIo();

  const { handelGraphQLSchemaFetchResult } = useGraphQLQuery();

  useEffect(() => {
    performance.mark("okapi:react-mounted");
    if (performance.getEntriesByName("okapi:html-ready").length) {
      performance.measure(
        "okapi:html-to-react",
        "okapi:html-ready",
        "okapi:react-mounted",
      );
    }
    const messageHandler = async (event: { data: any }) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.action) {
        case "setInitialData": {
          const {
            apiData,
            projectConfig,
            systemConfig,
            vscodeTheme,
            docBaseUrl,
          } = message.data;
          preloadRequestProtocol(apiData.target_type);
          updateProjectConfig(projectConfig);
          updateSystemConfig({
            ...useSystemConfig.getState().systemConfig,
            ...systemConfig,
          });
          updateVscodeTheme(vscodeTheme);
          updateDocBaseUrl(docBaseUrl);
          updateApisActiveData(apiData);
          updateApisActiveKey(apiData.target_id);
          performance.mark("okapi:data-ready");
          performance.measure(
            "okapi:react-to-data",
            "okapi:react-mounted",
            "okapi:data-ready",
          );
          resolveInitialData();
          setLodaing(false);
          break;
        }
        case "setApiList":
          updateApiOriginDetailsList(message?.data || []);
          updateAllApiDetailsData(
            (message?.data || []).reduce(
              (pre: { [x: string]: ApiDetailsData }, cur: ApiDetailsData) => {
                if (cur?.target_id) {
                  pre[cur.target_id] = cur;
                }
                return pre;
              },
              {},
            ),
          );
          break;
        case "apiSendResult":
          updateCurrentSendingData(JSON.parse(message.data));
          break;
        case "sseSendResult":
          const { streamResponse, ...reset } = message.data;
          const { currentSseSendingData } = useApis.getState();

          if (!currentSseSendingData) {
            return;
          }

          const newCurApiSendingDataSSE = produce(
            currentSseSendingData,
            (draft) => {
              forEach(
                keys(reset) as (keyof Omit<
                  ApiSendingDataSSE,
                  "streamResponse"
                >)[],
                (item) => {
                  if (item) {
                    draft[item] = reset[item] as any;
                  }
                },
              );

              if (draft.streamResponse) {
                draft.streamResponse = draft.streamResponse.concat(
                  streamResponse as ApiStreamResponseSSEItem[],
                );
              } else {
                draft.streamResponse =
                  streamResponse as ApiStreamResponseSSEItem[];
              }
            },
          );

          updateCurrentSseSendingData(newCurApiSendingDataSSE);
          break;
        case "setProjectConfig":
          updateProjectConfig({ ...message.data });
          break;
        case "setApiData":
          preloadRequestProtocol(message.data.target_type);
          updateApisActiveData({ ...message.data });
          if (message?.data?.target_id) {
            updateApisActiveKey(message?.data?.target_id);
          }

          resolveInitialData();
          setLodaing(false);
          break;
        case "setVscodeTheme":
          updateVscodeTheme(message.data);
          break;
        case "setSystemConfig":
          updateSystemConfig({ ...systemConfig, ...message.data });
          break;
        case "setDocBaseUrl":
          updateDocBaseUrl(message.data);
          break;
        case "setCodeHar":
          updateApiCodeHar(message.data);
          break;
        case "setWsResult":
          handelWsResult(message.data);
          break;
        case "setSocketIoResult":
          handelSocketIoResult(message.data);
          break;
        case "proxyFetchResult":
          handleProxyFetchResult(message.data);
          break;
        case "graphQLSchemaFetchResult":
          handelGraphQLSchemaFetchResult(message.data);
          break;
      }
    };
    window.addEventListener("message", messageHandler);
    // Register the listener before requesting data, including fast local replies.
    window.vscode.postMessage({ action: "getInitialData" });
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  return (
    <ConfigProvider
      getPopupContainer={getPopupContainer}
      prefixCls={"beautify"}
      // theme={{ ...customTheme, cssVar: true }}
      theme={{
        token: customTheme.token,
        components: customTheme.components,
      }}
      locale={antdLocale}
    >
      <AntdApp>
        <HotkeysProvider initiallyActiveScopes={["global", "apis"]}>
          <ThemeProvider theme={customTheme}>
            <GlobalThemeStyle />
            <GlobalStyle />
            <ErrorBoundary>
              <DndProvider backend={HTML5Backend}>
                <Suspense
                  fallback={
                    <Skeleton
                      active
                      paragraph={{ rows: 15, width: "100%" }}
                      loading
                    />
                  }
                >
                  <InitializedContent loading={lodaing} />
                </Suspense>
              </DndProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </HotkeysProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<TagPanel />);
