import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

import { Flex, SegmentedProps, Typography } from "@/shared/ui/base";

import { useMemoizedFn, useSafeState } from "ahooks";
import { includes, isEqual } from "lodash";

import CodeEditor from "@/shared/components/CodeEditor";
import SegmentedTabs from "@/shared/components/SegmentedTabs";
import ApisTypeTag from "@/shared/ui/ApisTypeTag";
import { APIS_TARGET_TYPE_ENUM } from "@/features/requests/constants";
import { ApiTypeMethod } from "@/features/requests/types/base";
import { ApiSendingData } from "@/features/requests/types/send";

import CommonTable from "../CommonTable";

const { Text } = Typography;

interface Props {
  sendingData?: Partial<ApiSendingData>;
}

const RealRequest: React.FC<Props> = ({ sendingData }) => {
  const { t } = useTranslation();
  const [tabsValue, setTabsValue] = useSafeState<string | number>("header");

  const handleOptionsChange: SegmentedProps["onChange"] = useMemoizedFn(
    (value) => {
      setTabsValue(value);
    },
  );

  const segmentedOptions = [
    {
      value: "header",
      label: "header",
      children: <CommonTable value={sendingData?.request?.headers || []} />,
    },
    {
      value: "query",
      label: "params",
      children: <CommonTable value={sendingData?.request?.querys || []} />,
    },
    {
      value: "path",
      label: "path",
      children: <CommonTable value={sendingData?.request?.paths || []} />,
    },
    {
      value: "body",
      label: "body",
      children: <BodyParameter request={sendingData?.request} />,
    },
  ];

  const tabBarExtraContent = isEqual(tabsValue, "body") ? (
    <Flex align={"center"} className={styles.tabBarExtraContent}>
      <div className={slots.title}>{t("supplement.type")}:</div>
      <div className={slots.content}>{sendingData?.request?.mode}</div>
    </Flex>
  ) : null;

  return (
    <div className={styles.container}>
      <Flex vertical={true} gap={8} className={styles.requestItem}>
        <Text className={slots.title}>{t("supplement.req_url")}</Text>
        <div
          className={[slots["content-warp"], slots["base-info-wrap"]].join(" ")}
        >
          <Flex align="flex-start">
            <ApisTypeTag
              targetType={APIS_TARGET_TYPE_ENUM.API}
              method={(sendingData?.request?.method as ApiTypeMethod) || "GET"}
            />
            <div className={slots.url}>{sendingData?.request?.url}</div>
          </Flex>
        </div>
      </Flex>
      <Flex vertical={true} gap={8} className={styles.requestItem}>
        <Text className={slots.title}>{t("supplement.req_param")}</Text>
        <div
          className={[slots["content-warp"], slots["content-request"]].join(
            " ",
          )}
        >
          <SegmentedTabs
            options={segmentedOptions}
            tabBarExtraContent={tabBarExtraContent}
            value={tabsValue}
            onChange={handleOptionsChange}
          />
        </div>
      </Flex>
    </div>
  );
};

const BodyParameter = ({
  request,
}: {
  request?: ApiSendingData["request"];
}) => {
  const { t } = useTranslation();
  const { mode } = request || {};

  if (mode === "none") {
    return <Text>{t("supplement.no_req_param")}</Text>;
  }

  if (mode === "binary") {
    return <Text>{t("supplement.binary_param")}</Text>;
  }

  if (
    includes(["json", "xml", "javascript", "plain", "html", "msgpack"], mode)
  ) {
    return (
      <div style={{ height: 300 }}>
        <CodeEditor
          language={mode === "msgpack" ? "json" : mode}
          height="100%"
          value={request?.body as string}
          readOnly
        />
      </div>
    );
  }

  if (includes(["form-data", "urlencoded"], mode)) {
    return (
      <CommonTable
        value={(request?.body as { [x: string]: string | string[] }) || []}
      />
    );
  }
};

export default RealRequest;
