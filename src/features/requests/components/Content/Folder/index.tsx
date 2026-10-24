import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, FunctionComponent, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SegmentedProps } from "@/shared/ui/base";

import { useMemoizedFn, useSafeState } from "ahooks";
import { find, head, includes, isArray, last, map } from "lodash";

import { SegmentedTabs } from "@/shared/components";

import { APIS_TARGET_TYPE_ENUM } from "@/features/requests/constants";
import { useSystemConfig } from "@/app/store";

import ContentItemWrap from "./components/ContentItemWrap";
import { APIS_CONTENT_MAP } from "./constants";

import { ApiComponentType } from "@/features/requests/types/api";
import ToolBar from "./ToolBar";

const Content: FC<ApiComponentType> = ({ apisData }) => {
  const { t } = useTranslation();
  const targetType = apisData?.target_type;

  const [tabsValue, setTabsValue] = useSafeState<string | number>();

  const updateTabsValue = async (
    targetTabs: {
      value: string;
      label: string;
      children: FunctionComponent<{ apisData: any; onApisDataChange: any }>;
    }[],
    newTabsValue: string,
  ) => {
    let value = newTabsValue;
    setTabsValue(value);
  };

  const result = useMemo(() => {
    const targetTabs = APIS_CONTENT_MAP[`${targetType}`];

    if (isArray(targetTabs)) {
      const { systemConfig } = useSystemConfig.getState();
      const { open_new_tab } = systemConfig;

      let newTabsValue = head(targetTabs)?.value || "";

      if (
        includes(
          [APIS_TARGET_TYPE_ENUM.API, APIS_TARGET_TYPE_ENUM.SOCKET_METHOD],
          targetType,
        )
      ) {
        // HTTP, TCP follow config
        if (find(targetTabs, (findItem) => findItem.value === open_new_tab)) {
          newTabsValue = open_new_tab;
        } else {
          newTabsValue = head(targetTabs)?.value || "";
        }
      } else if (
        !includes(
          [APIS_TARGET_TYPE_ENUM.DOC, APIS_TARGET_TYPE_ENUM.FOLDER],
          targetType,
        )
      ) {
        // Other types check if config exists in tabs, otherwise use the last one
        if (find(targetTabs, (findItem) => findItem.value === open_new_tab)) {
          newTabsValue = open_new_tab;
        } else {
          newTabsValue = last(targetTabs)?.value || "";
        }
      }
      updateTabsValue(targetTabs, newTabsValue);
    }

    return targetTabs;
  }, [targetType]);

  const segmentedOptions = useMemo(
    () =>
      (isArray(result) &&
        map(result, (item) => ({
          ...item,
          children: (
            <ContentItemWrap
              key={apisData.target_id}
              apisData={apisData}
              contentType={item.value}
              activeContentType={tabsValue}
              element={item.children}
            />
          ),
        }))) ||
      [],
    [result, tabsValue, apisData],
  );

  const handleOptionsChange: SegmentedProps["onChange"] = useMemoizedFn(
    async (value) => {
      setTabsValue(value);
    },
  );

  if (!result) {
    return null;
  }

  return (
    <>
      {isArray(result) ? (
        <div className={styles.container}>
          <SegmentedTabs
            options={segmentedOptions}
            wrapClassName={slots["custom-segmented-tabs-wrap"]}
            value={tabsValue}
            onChange={handleOptionsChange}
            tabBarExtraContent={<ToolBar />}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <ContentItemWrap
            key={apisData.target_id}
            apisData={apisData}
            element={result}
          />
        </div>
      )}
    </>
  );
};

const MemoizedContent = memo(Content);

export default MemoizedContent;
