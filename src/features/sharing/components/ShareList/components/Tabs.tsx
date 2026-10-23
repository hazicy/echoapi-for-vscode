import styles from "../style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { Checkbox, Flex, Tabs, Tooltip, Typography } from "@/shared/ui/base";

import { SHARE_TAB_LIST } from "../constants";
import { TabsProps } from "../types";

import cn from "classnames";

import { isArray } from "lodash";
import { Empty } from "@/shared/ui";
import { ApiDetailsData } from "@/features/requests/types/api";
import ApisColorPrefixIcon from "@/shared/ui/ApisColorPrefixIcon";
import { getBaseIconOfTargetType } from "@/shared/utils/common";
import { formatTimeToDateTimeLong } from "@/shared/utils/time";
import { useMemo } from "react";

const TabsPanel = (props: TabsProps) => {
  const {
    tabExtraContent,
    checkedList,
    lists,
    listExtraContent,
    setCheckedList,
  } = props || {};

  const renderContent = (item: ApiDetailsData & { share_time: number }) => {
    return (
      <div
        key={item.target_id}
        onClick={() => {}}
        className={cn(
          styles.itemTitle,
          cn({
            [slots["select-item"]]: false,
          }),
        )}
      >
        <div className={slots.name}>
          <Checkbox
            onClick={(e) => e?.stopPropagation()}
            value={item.target_id}
          ></Checkbox>
          <ApisColorPrefixIcon
            className={slots["panel-icon"]}
            icon={getBaseIconOfTargetType(item.target_type).icon}
            gradientColor={
              getBaseIconOfTargetType(item.target_type).gradientColor
            }
          />
          <Tooltip
            title={
              <Flex gap={4} vertical>
                <Typography.Text>{item?.name}</Typography.Text>
                <Typography.Text>{item?.url}</Typography.Text>
              </Flex>
            }
          >
            <Typography.Text ellipsis style={{ flex: 1 }}>
              {item.name}
            </Typography.Text>
          </Tooltip>
        </div>
        <div className={slots.time}>
          {formatTimeToDateTimeLong(item.share_time)}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={slots["more-operate-wrap"]}
        >
          {listExtraContent(item.target_id, item)}
        </div>
      </div>
    );
  };
  const tabsItems = useMemo(() => {
    return SHARE_TAB_LIST.map((item) => ({
      label: item.label,
      key: item.key,
      children: (
        <Checkbox.Group
          value={checkedList}
          onChange={(list) => {
            setCheckedList(list);
          }}
        >
          {isArray(lists) && lists.length > 0 ? (
            <div className={styles.shareList}>
              {lists.map((item) => renderContent(item))}
            </div>
          ) : (
            <Empty />
          )}
        </Checkbox.Group>
      ),
    })) as any;
  }, [checkedList, lists]);
  return (
    <div className={styles.tabs}>
      <Tabs
        tabBarGutter={6}
        destroyInactiveTabPane
        tabBarExtraContent={tabExtraContent}
        items={tabsItems}
      />
    </div>
  );
};

export default TabsPanel;
