import styles from "./style.module.css";
import { FC, memo, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useMemoizedFn, useSafeState } from "ahooks";
import produce from "immer";
import { isEmpty, isEqual } from "lodash";

import ResizablePanels from "@/shared/components/ResizablePanels";
import ResponseResult from "@/features/requests/components/ResponseResult";
import ResponseAssert from "@/features/requests/components/ResponseAssert";
import ErrorContext from "@/features/requests/components/Response/ErrorContext";
import Error from "@/features/requests/components/Response/components/Error";
import { STATUS_CODE } from "@/shared/constants/common";
import { useSystemConfig } from "@/app/store";
import { BaseResponse } from "@/features/requests/types/response";
import { ApiSendingData } from "@/features/requests/types/send";
import { ChangeFuncType, DirectionType } from "@/shared/types/common";

const panelProps = {
  defaultSize: 50,
  minSize: 3,
  collapsible: true,
  collapsedSize: 3,
};

interface Props {
  resultIncludesTabs?: string[];
  sendingData?: Partial<ApiSendingData>;
  responseData: BaseResponse;
  onResponseDataChange: (value: BaseResponse) => void;
}

const Realtime: FC<Props> = memo((props) => {
  const { t } = useTranslation();
  const {
    resultIncludesTabs,
    sendingData,
    responseData,
    onResponseDataChange,
  } = props || {};

  const { showError, errorMsg } = useContext(ErrorContext);

  const systemConfigTabDirection = useSystemConfig(
    (state) => state.systemConfig?.tab_direction,
  );

  const [curDirection, setCurDirection] =
    useSafeState<DirectionType>("horizontal");

  const responseResultRef = useRef<any>(null);
  const resizablePanelsRef = useRef<any>(null);

  useEffect(() => {
    if (!systemConfigTabDirection) {
      return;
    }

    if (systemConfigTabDirection === 1) {
      setCurDirection("horizontal");
    }

    if (systemConfigTabDirection === -1) {
      setCurDirection("vertical");
    }

    const size = panelProps.collapsedSize;
    resizablePanelsRef.current?.setPanelGroupLayout([100 - size, size]);
  }, [systemConfigTabDirection, resizablePanelsRef]);

  useEffect(() => {
    const { systemConfig } = useSystemConfig.getState();

    if (isEmpty(sendingData) || !isEqual(sendingData?.sendStatus, "initial")) {
      return;
    }

    // according to system config, whether to show assertion and validation results by default
    if (
      isEqual(
        systemConfig.assertions_and_validation_results,
        STATUS_CODE.ENABLE,
      )
    ) {
      resizablePanelsRef.current?.resetLayout();
    } else {
      const size = panelProps.collapsedSize;
      resizablePanelsRef.current?.setPanelGroupLayout([100 - size, size]);
    }

    // for non-Monaco type, jump to preview
    if (!isEqual(sendingData?.response?.fit_for_show, "Monaco")) {
      responseResultRef.current?.setTabsValue("preview");
      return;
    } else if (
      isEqual(systemConfig.send_after_auto_beautify, STATUS_CODE.ENABLE)
    ) {
      // Auto-switch to "beautify" panel after sending based on system config

      responseResultRef.current?.setTabsValue("beautify");
    }
  }, [sendingData]);

  const handleResponseDataChange: ChangeFuncType<BaseResponse> = useMemoizedFn(
    (key, newValue) => {
      const newResponseData = produce(responseData, (draft) => {
        draft![key] = newValue;
      });

      onResponseDataChange?.(newResponseData);
    },
  );

  if (showError) {
    return <Error errorMessage={errorMsg || ""} />;
  }

  return (
    <div className={styles.container}>
      <ResizablePanels
        ref={resizablePanelsRef}
        panelGroupProps={{ direction: curDirection }}
        leftPanel={
          <ResponseResult
            ref={responseResultRef}
            resultIncludesTabs={resultIncludesTabs}
            rawHtml={sendingData?.response?.raw_body}
            data={sendingData?.response}
            html={sendingData?.visualizerHtml}
          />
        }
        leftPanelProps={{
          ...panelProps,
          collapseTitle: t("common.response_component.title"),
        }}
        rightPanel={
          <ResponseAssert
            sendingData={sendingData}
            responseDataExample={responseData?.example}
            responseDataIsCheckResult={responseData?.is_check_result}
            onChange={handleResponseDataChange}
          />
        }
        rightPanelProps={{
          ...panelProps,
          collapseTitle: t("common.test_component.title"),
        }}
        showRightCollapseBtn
      />
    </div>
  );
});

export default Realtime;
