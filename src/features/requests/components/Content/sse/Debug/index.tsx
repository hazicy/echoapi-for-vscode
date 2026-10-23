import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, lazy, useMemo, useState } from "react";

import { useSafeState } from "ahooks";
import { t } from "i18next";

import { SuspenseContent } from "@/shared/components";

import ResizablePanels from "@/shared/components/ResizablePanels";
import ResponseRealtimeContext from "@/features/requests/components/Response/components/Realtime/context";
import {
  ApiComponentType,
  ApiDetailsData,
} from "@/features/requests/types/api";
import { DirectionType } from "@/shared/types/common";
import { importDelay } from "@/shared/utils/common";
import ToolBar from "../../api/Debug/ToolBar";
import Header from "./Header";
import { isEqual } from "lodash";
import { genUrlByQuery } from "@/features/requests/utils/apis";
import produce from "immer";
import { Button } from "@/shared/ui";
import { Flex } from "@/shared/ui/base";
import { openEnvPage } from "@/features/requests/events/env";

const Request = lazy(() => importDelay(import("./Request")));
const Response = lazy(() => importDelay(import("./Response")));

const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};

const ApiDebug: FC<ApiComponentType> = ({ apisData, onApisDataChange }) => {
  const [apiScreenDirection, setApiScreenDirection] =
    useSafeState<DirectionType>("vertical");
  const [requestTabActiveKey, setRequestTabActiveKey] =
    useState<string>("Headers");
  const handleDirectionChange = (direction: DirectionType) => {
    setApiScreenDirection(direction);
  };

  const onRequestDataChange = (val: any) => {
    onApisDataChange(
      produce(apisData as ApiDetailsData, (draft) => {
        draft.request = val;
        // Query parameters updated and appended to URL bar
        if (!isEqual(draft.request.query, apisData.request.query)) {
          draft.url = genUrlByQuery(
            draft.url,
            draft.request.query?.parameter,
            draft.request.query?.query_add_equal,
          );
        }
      }),
    );
  };

  const handleToGlobalParams = () => {
    openEnvPage({
      global_param: "global_param",
      global_param_tab_key: requestTabActiveKey,
    });
  };

  const tabBarExtraContent = useMemo(() => {
    return (
      <Flex align="center">
        <Button
          onClick={handleToGlobalParams}
          type="text"
          mode="light"
          size="small"
          style={{ padding: "4px 6px" }}
          className={slots["beautify-text-btn-highlight"]}
        >
          {t("common.request_table.global")}{" "}
          {requestTabActiveKey === "Path" ? "Para" : requestTabActiveKey}
        </Button>
      </Flex>
    );
  }, [requestTabActiveKey]);

  return (
    <>
      <ToolBar
        apisData={apisData as ApiDetailsData}
        onApisDataChange={onApisDataChange}
      />
      <header>
        <Header
          type={"sse"}
          apisData={apisData as ApiDetailsData}
          onApisDataChange={onApisDataChange}
        />
      </header>
      <main>
        <ResponseRealtimeContext.Provider
          value={{ direction: apiScreenDirection }}
        >
          <ResizablePanels
            showDirectionBtn
            panelGroupProps={{
              autoSaveId: "api_debug_container_resize_save_id",
              direction: apiScreenDirection,
            }}
            leftPanelProps={{
              ...panelProps,
              collapseTitle: t("supplement.request_panel"),
            }}
            rightPanelProps={{
              ...panelProps,
              collapseTitle: t("supplement.response_panel"),
            }}
            leftPanel={
              <SuspenseContent>
                <div className={styles.request}>
                  <Request
                    tabOptions={{
                      activeKey: requestTabActiveKey,
                      onChange: (key: string) => setRequestTabActiveKey(key),
                    }}
                    tabBarExtraContent={tabBarExtraContent}
                    direction={apiScreenDirection}
                    apisData={apisData}
                    onRequestDataChange={onRequestDataChange}
                  />
                </div>
              </SuspenseContent>
            }
            rightPanel={
              <SuspenseContent>
                <Response
                  apisData={apisData}
                  onApisDataChange={onApisDataChange}
                />
              </SuspenseContent>
            }
            onDirectionChange={handleDirectionChange}
          />
        </ResponseRealtimeContext.Provider>
      </main>
    </>
  );
};

export default ApiDebug;
