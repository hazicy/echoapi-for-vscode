import slots from "@/shared/ui/base/slots.module.css";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";

import { Flex, SegmentedProps, Select, message } from "@/shared/ui/base";

import { useSafeState } from "ahooks";
import { find, forEach, isArray, isPlainObject, map } from "lodash";

import SegmentedTabs from "@/shared/components/SegmentedTabs";
import IconFont from "@/shared/ui/IconFont";
import { BaseResponse } from "@/features/requests/types/response";
import { ApiSendingData } from "@/features/requests/types/send";
import { copyStringToClipboard } from "@/shared/utils/common";
import { parseStreamToRaw } from "@/shared/utils/parse";

import {
  RAW_ENCODE,
  RESPONSE_RESULT_TABS_LIST,
  RESPONSE_TYPE,
} from "./constants";

import styles from "./style.module.css";

interface Props {
  rawHtml?: string;
  mode?: string;
  data?: ApiSendingData["response"];
  defaultRawEncode?: string;
  html?: string | null;
  resultIncludesTabs?: string[];
  onChange?: (value: BaseResponse) => void;
  responseData?: BaseResponse;
  saveExampleVisible?: boolean;
  warpVisible?: boolean;
  saveSocketMessageDom?: any;
  setMode?: (value: string) => void;
}

const ResponseResult = forwardRef((props: Props, ref) => {
  const { t } = useTranslation();
  const {
    resultIncludesTabs = ["beautify", "native", "preview", "visualization"],
    defaultRawEncode,
    data,
    rawHtml,
    warpVisible = true,
    saveSocketMessageDom = null,
    setMode,
  } = props || {};

  const [rawEncode, setRawEncode] = useSafeState(defaultRawEncode || "utf8");
  const [rawType, setRawType] = useSafeState<string>("");
  const [tabsValue, setTabsValue] = useSafeState<string | number>();
  const [warp, setWarp] = useSafeState(true);

  useEffect(() => {
    setRawType(data?.mime_type.ext || "json");
  }, [data?.mime_type.ext]);

  useImperativeHandle(ref, () => {
    return {
      setTabsValue,
    };
  });

  const result = useMemo(() => {
    const resultList: any = [];
    forEach(resultIncludesTabs, (key: string) => {
      const item = find(
        RESPONSE_RESULT_TABS_LIST,
        (item) => item.value === key,
      );
      if (item) {
        resultList.push(item);
      }
    });

    const key = resultList[0]?.value;

    setTabsValue(key);

    return resultList;
  }, []);

  const parsedRawHtml = useMemo(() => {
    if (data?.stream?.data && isPlainObject(data?.mime_type)) {
      if (rawType === "auto") {
        return parseStreamToRaw(data?.stream?.data, data?.mime_type, rawEncode);
      } else {
        const mime_type = RESPONSE_TYPE?.find((e) => e.ext === rawType);
        return parseStreamToRaw(
          data?.stream?.data,
          mime_type || data?.mime_type,
          rawEncode,
        );
      }
    }

    return "";
  }, [data?.stream?.data, data?.mime_type, rawEncode, rawType]);

  const beautifyProps = {
    mode: rawType,
    editorOptions: warp ? {} : { wordWrap: "off" },
  };

  const segmentedOptions =
    (isArray(result) &&
      map(result, (item) => ({
        label: item.label,
        key: item.value,
        value: item.value,
        children: (
          <item.children
            {...props}
            key={item.value}
            rawEncode={rawEncode}
            rawHtml={parsedRawHtml || rawHtml}
            {...beautifyProps}
          />
        ),
      }))) ||
    [];

  const handleOptionsChange: SegmentedProps["onChange"] = (value) => {
    setTabsValue(value);
  };

  const handleCopy = () => {
    if (!rawHtml) {
      message.error(t("supplement.clipboard_error"));
      return;
    }

    copyStringToClipboard(rawHtml, () =>
      message.success(t("supplement.clipboard_success")),
    );
  };

  useEffect(() => {
    setMode?.(rawType);
  }, [rawType]);
  return (
    <div className={styles.container}>
      <SegmentedTabs
        options={segmentedOptions}
        value={tabsValue}
        onChange={handleOptionsChange}
        wrapClassName={slots["response-result-tabs-wrap"]}
        tabBarExtraContent={
          <Flex className={slots["tab-bar-extra-content-wrap"]} gap={8}>
            <Select
              // style={{ width: 110 }}
              options={RESPONSE_TYPE.map(({ label, ext }) => ({
                label,
                value: ext,
              }))}
              popupMatchSelectWidth={false}
              value={rawType || "json"}
              onChange={(newVal: string) => {
                if (newVal === "auto") {
                  setRawType(data?.mime_type?.ext || "json");
                } else {
                  setRawType(newVal);
                }
              }}
            />
            <Select
              // style={{ width: 110 }}
              options={Object.keys(RAW_ENCODE).map((key: string) => ({
                label: key,
                value: RAW_ENCODE[key],
              }))}
              popupMatchSelectWidth={false}
              value={rawEncode || "utf8"}
              onChange={(newVal: string) => setRawEncode(newVal)}
            />
            <button
              type="button"
              className={styles.toolButton}
              aria-label="Copy response"
              title={t("common.copy")}
              onClick={handleCopy}
            >
              <IconFont type="icon-copy" />
            </button>
            {warpVisible && (
              <button
                type="button"
                className={styles.toolButton}
                aria-label="Toggle word wrap"
                aria-pressed={warp}
                title="Toggle word wrap"
                onClick={() => setWarp(!warp)}
              >
                <IconFont type="icon-huanhang" />
              </button>
            )}
            {saveSocketMessageDom}
          </Flex>
        }
      />
    </div>
  );
});

const PureResponseResult = memo(ResponseResult);

export default PureResponseResult;
