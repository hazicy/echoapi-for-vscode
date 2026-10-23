import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

import { Flex, SegmentedProps, Typography } from "@/shared/ui/base";

import { useMemoizedFn, useSafeState } from "ahooks";

import SegmentedTabs from "@/shared/components/SegmentedTabs";

import CommonTable from "./CommonTable";

const { Text } = Typography;

interface Props {
  sendingData?: any;
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
      label: "query",
      children: <CommonTable value={sendingData?.request?.query || []} />,
    },
  ];

  return (
    <div className={styles.container}>
      <Flex vertical={true} gap={8} className={styles.requestItem}>
        <Text className={slots.title}>{t("supplement.req_url")}</Text>
        <div
          className={[slots["content-warp"], slots["base-info-wrap"]].join(" ")}
        >
          <Flex align="flex-start">
            <div className={slots.url}>{sendingData?.url}</div>
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
            value={tabsValue}
            onChange={handleOptionsChange}
          />
        </div>
      </Flex>
    </div>
  );
};

export default RealRequest;
