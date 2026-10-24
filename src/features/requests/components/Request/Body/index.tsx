import styles from "./style.module.css";
import classNames from "classnames";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, lazy, useMemo } from "react";

import { Flex, message, Select, Tooltip } from "@/shared/ui/base";
import type { RadioChangeEvent, SelectProps } from "@/shared/ui/base";

import produce from "immer";
import { includes, isEqual, isString, map, toUpper, values } from "lodash";

import SuspenseContent from "@/shared/components/SuspenseContent";
import Radio from "@/shared/ui/Radio";
import {
  REQUEST_BODY_MODE_ENUM,
  REQUEST_BODY_RAW_MODE_ENUM,
  REQUEST_RAW_MODE_LIST,
} from "@/features/requests/constants";
import { RequestBodyContentType } from "@/features/requests/types/request";

import { RequestBodyProps } from "./types";

import { Button, IconFont } from "@/shared/ui";
import { useSystemConfig } from "@/app/store";
import { useTranslation } from "react-i18next";

const RequestBodyBinary = lazy(() => import("./components/Binary"));
const RequestBodyFormData = lazy(() => import("./components/FormData"));
const RequestBodyNone = lazy(() => import("./components/None"));
const RequestBodyRaw = lazy(() => import("./components/Raw"));
const RequestBodyUrlencoded = lazy(() => import("./components/Urlencoded"));

const RequestBody: FC<RequestBodyProps> = (props) => {
  const { t } = useTranslation();

  const { apiData, value, onChange } = props;
  const rowOptions = useMemo(
    () =>
      map(REQUEST_RAW_MODE_LIST, (item) => ({
        label: toUpper(item),
        value: item,
      })),
    [REQUEST_RAW_MODE_LIST],
  );
  const systemConfigTabDirection = useSystemConfig(
    (state) => state.systemConfig?.tab_direction,
  );
  const bodyModeOptions = useMemo(
    () =>
      map(values(REQUEST_BODY_MODE_ENUM), (item) => ({
        label: item,
        value: item,
      })),
    [],
  );

  const isRowMode = useMemo(
    () => includes(REQUEST_RAW_MODE_LIST, value?.mode),
    [value?.mode],
  );

  const calcBodyModeValue = useMemo(
    () =>
      includes(REQUEST_RAW_MODE_LIST, value?.mode)
        ? REQUEST_BODY_MODE_ENUM.RAW
        : value?.mode,
    [value?.mode],
  );

  const calcRadioValue = useMemo(
    () =>
      includes(REQUEST_RAW_MODE_LIST, value?.mode)
        ? REQUEST_BODY_MODE_ENUM.RAW
        : value?.mode,
    [value?.mode],
  );

  const bodyContent = useMemo(() => {
    const bodyMap = {
      [REQUEST_BODY_MODE_ENUM.NONE]: <RequestBodyNone />,
      [REQUEST_BODY_MODE_ENUM.FORM_DATA]: <RequestBodyFormData {...props} />,
      [REQUEST_BODY_MODE_ENUM.URLENCODED]: <RequestBodyUrlencoded {...props} />,
      [REQUEST_BODY_MODE_ENUM.BINARY]: (
        <RequestBodyBinary value={value} onChange={onChange} />
      ),
      [REQUEST_BODY_MODE_ENUM.RAW]: (
        <RequestBodyRaw
          value={value}
          onChange={onChange}
          mode={value?.mode}
          isParameter={[
            REQUEST_BODY_RAW_MODE_ENUM.JAVASCRIPT,
            REQUEST_BODY_RAW_MODE_ENUM.PLAIN,
            REQUEST_BODY_RAW_MODE_ENUM.HTML,
          ].includes(value?.mode as REQUEST_BODY_RAW_MODE_ENUM)}
        />
      ),
    };

    return bodyMap[calcRadioValue as REQUEST_BODY_MODE_ENUM];
  }, [calcRadioValue, value, value?.parameter, value?.parameter?.length]);

  const handleModeChange = (newValue: RequestBodyContentType) => {
    if (!value) {
      return;
    }

    const newRequestData = produce(value, (draft: { mode: string }) => {
      draft.mode = newValue;
    });

    onChange?.("body", newRequestData);
  };

  const handleBodyModeChange = (value: any) => {
    // Special handling in raw mode
    if (isEqual(value, REQUEST_BODY_MODE_ENUM.RAW)) {
      handleModeChange(REQUEST_BODY_RAW_MODE_ENUM.JSON);
      return;
    }

    handleModeChange(value);
  };

  const handleGenerateParameterByAi = () => {
    import("@/features/requests/utils/generateMockBody")
      .then(({ generateMockBody }) => generateMockBody(value?.raw))
      .then((mockData: any) => {
        if (!value) {
          return;
        }
        const newRequestData = produce(value, (draft) => {
          if (isString(mockData) && mockData?.length > 0) {
            draft.raw = mockData;
          }
        });

        onChange?.("body", newRequestData);
      })
      .catch((error: string) => {
        message.error(error);
      });
  };

  const handleBodyModeSelectChange: SelectProps["onChange"] = (value) => {
    handleBodyModeChange(value);
  };
  const handleBodyModeRadioChange = (event: RadioChangeEvent) => {
    const value = event.target.value;
    handleBodyModeChange(value);
  };

  return (
    <div className={classNames(styles.container, "request-body-container")}>
      <Flex vertical>
        <Flex
          className={slots["request-body-header"]}
          align="center"
          justify="space-between"
        >
          <Flex align="center">
            {isEqual(systemConfigTabDirection, -1) ? (
              <Select
                size="small"
                style={{ marginInlineEnd: 12 }}
                popupMatchSelectWidth={false}
                options={bodyModeOptions}
                value={calcBodyModeValue}
                onChange={handleBodyModeSelectChange}
              />
            ) : (
              <Radio.Group
                style={{ paddingLeft: 8 }}
                options={bodyModeOptions}
                value={calcBodyModeValue}
                onChange={handleBodyModeRadioChange}
              />
            )}
            {isRowMode && (
              <Select
                size="small"
                popupMatchSelectWidth={false}
                options={rowOptions}
                value={value?.mode}
                onChange={(value) => handleModeChange(value)}
              />
            )}
          </Flex>
          {apiData?.target_type === "api" && (
            <Flex className={slots["other-btn"]} align="center">
              {value?.mode === "json" && (
                <Tooltip title="Auto Generate">
                  <Flex>
                    <Button
                      onClick={handleGenerateParameterByAi}
                      type="text"
                      mode="light"
                      size="small"
                      icon={
                        <IconFont
                          style={{
                            color: "var(--icon-color)",
                            fontSize: "16px",
                          }}
                          type="icon-ai-generate-01"
                        />
                      }
                    ></Button>
                  </Flex>
                </Tooltip>
              )}
            </Flex>
          )}
        </Flex>
        <SuspenseContent>
          <div className={slots["request-body-content-wrap"]}>
            {bodyContent}
          </div>
        </SuspenseContent>
      </Flex>
    </div>
  );
};

export default RequestBody;
