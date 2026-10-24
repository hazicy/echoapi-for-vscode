import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, lazy, useMemo, useState } from "react";
import { useSafeState } from "ahooks";
import { Flex } from "@/shared/ui/base";
import produce from "immer";
import { DirectionType } from "@/shared/types/common";
import { ResizablePanels, SuspenseContent } from "@/shared/components";

import { isEqual } from "lodash";
import { useApis } from "@/app/store";
import Request from "@/features/requests/components/Request";
import Response from "./Response";
import Header from "./Header";
import ToolBar from "./ToolBar";
import { useTranslation } from "react-i18next";
import {
  ApiComponentType,
  ApiDetailsData,
} from "@/features/requests/types/api";
import { genUrlByQuery } from "@/features/requests/utils/apis";
import { Button } from "@/shared/ui";
const GenerateCodeDrawer = lazy(
  () => import("@/features/requests/components/GenerateCodeDrawer"),
);
import context from "@/shared/components/RawEditor/visualizationContext";
import { openEnvPage } from "@/features/requests/events/env";

interface ContentProps {
  value?: ApiDetailsData;
  curApiSendingData?: any;
}

const panelProps = {
  defaultSize: 50,
  minSize: 5,
  collapsible: true,
  collapsedSize: 5,
};

const ApiDebug: FC<ApiComponentType> = ({ apisData, onApisDataChange }) => {
  const { t } = useTranslation();
  const [apiScreenDirection, setApiScreenDirection] =
    useSafeState<DirectionType>("horizontal");
  const updateApiCodeHar = useApis((store) => store.updateApiCodeHar);
  const [openGenerateCode, setOpenGenerateCode] = useState<boolean>(false);

  const [requestTabActiveKey, setRequestTabActiveKey] =
    useState<string>("Params");
  const { Provider } = context;
  const handleDirectionChange = (direction: DirectionType) => {
    // setApiScreenDirection(direction);
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

  const handleToCode = () => {
    updateApiCodeHar({});
    setOpenGenerateCode(true);
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
          onClick={handleToCode}
          type="text"
          mode="light"
          size="small"
          style={{ padding: "4px 6px" }}
          className={slots["beautify-text-btn-highlight"]}
        >
          {t("system_settings.shortcuts.apis_detail.code")}
        </Button>
        <Button
          onClick={handleToGlobalParams}
          type="text"
          mode="light"
          size="small"
          style={{ padding: "4px 6px" }}
          className={slots["beautify-text-btn-highlight"]}
        >
          {t("global_setting.global_title")}{" "}
          {requestTabActiveKey === "Path" ? "Para" : requestTabActiveKey}
        </Button>
      </Flex>
    );
  }, [requestTabActiveKey]);

  return (
    <>
      <ToolBar
        showLayoutControl
        apisData={apisData as ApiDetailsData}
        onApisDataChange={onApisDataChange}
      />
      <header>
        <Header
          apisData={apisData as ApiDetailsData}
          onApisDataChange={onApisDataChange}
        />
      </header>
      <main>
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
              <Provider
                value={{
                  isDebugArea: true,
                }}
              >
                <div className={styles.container}>
                  <Request
                    tabOptions={{
                      activeKey: requestTabActiveKey,
                      onChange: (key: string) => setRequestTabActiveKey(key),
                    }}
                    direction={apiScreenDirection}
                    requestData={(apisData as ApiDetailsData)?.request}
                    apiData={apisData}
                    onRequestDataChange={onRequestDataChange}
                    tabBarExtraContent={tabBarExtraContent}
                    target_id={apisData?.target_id}
                  />
                </div>
              </Provider>
            </SuspenseContent>
          }
          rightPanel={
            <SuspenseContent>
              <Response
                apisData={apisData as ApiDetailsData}
                onApisDataChange={onApisDataChange}
              />
            </SuspenseContent>
          }
          onDirectionChange={handleDirectionChange}
        />
      </main>
      {openGenerateCode && (
        <SuspenseContent>
          <GenerateCodeDrawer
            value={apisData}
            onClose={() => setOpenGenerateCode(false)}
          />
        </SuspenseContent>
      )}
    </>
  );
};

export default ApiDebug;
