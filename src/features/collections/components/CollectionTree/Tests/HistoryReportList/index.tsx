import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { useCallback } from "react";

import { TestingReportList } from "@/features/testing/types/res";
import { isArray, last } from "lodash";
import {
  Dropdown,
  Flex,
  MenuProps,
  Tooltip,
  Typography,
} from "@/shared/ui/base";
import cn from "classnames";
import { IconFont } from "@/shared/ui";
import { formatTimeToDateTimeLong } from "@/shared/utils/time";
import SvgTestSuccess from "@/shared/assets/icon/test_success.svg?react";
import SvgTestError from "@/shared/assets/icon/test_error.svg?react";
import { useApis } from "@/app/store";

import { useTranslation } from "react-i18next";

type HistoryReportListProps = {
  reportList: TestingReportList[];
};

const HistoryReportList = ({ reportList }: HistoryReportListProps) => {
  const { t } = useTranslation();

  const testsActiveKey = useApis((state) => state.testsActiveKey);
  const updateTestsActiveKey = useApis((state) => state.updateTestsActiveKey);

  const reportItemClick = (reportData: TestingReportList) => {
    updateTestsActiveKey(reportData?.report_id);
    window?.vscode.postMessage({
      action: "openReportData",
      data: reportData,
    });
  };

  const dropdownContextMenu: MenuProps["items"] = [
    {
      label: (
        <Flex gap={8} align="center">
          <IconFont type="icon-delete" />
          {t("common.folder_operate.delete")}
        </Flex>
      ),
      key: "delete",
    },
  ];

  const handleMoreOperateClick = async (
    nodeItem: TestingReportList,
    keyPath: string[],
  ) => {
    const actionType = last(keyPath) || "";
    switch (actionType) {
      case "delete":
        window?.vscode.postMessage({
          action: "deleteReport",
          data: { report_id: nodeItem.report_id },
        });
        break;
      default:
        break;
    }
  };

  const nodeItemDropdownContextMenu = useCallback(
    (nodeItem: TestingReportList): MenuProps => {
      return {
        items: dropdownContextMenu,
        onClick: ({ keyPath }) => handleMoreOperateClick(nodeItem, keyPath),
      };
    },
    [],
  );

  return (
    <div className={styles.container}>
      {isArray(reportList) &&
        reportList.length > 0 &&
        reportList.map((item) => (
          <Dropdown
            key={item.report_id}
            trigger={["contextMenu"]}
            menu={nodeItemDropdownContextMenu(item)}
          >
            <div
              onClick={() => reportItemClick(item)}
              className={cn(
                styles.historyReportListItem,
                cn({
                  [slots["select-item"]]: testsActiveKey === item.report_id,
                }),
              )}
            >
              <Flex gap={6} align="center" style={{ minWidth: 0 }}>
                {item?.complete?.http?.success ===
                item?.complete?.http?.total ? (
                  <SvgTestSuccess className={slots["icon-ok"]} />
                ) : (
                  <SvgTestError className={slots["icon-small-close"]} />
                )}
                <Tooltip placement="topLeft" title={item?.report_name}>
                  <Typography.Text style={{ fontSize: "12px" }} ellipsis>
                    {item?.report_name || "Test Report"}
                  </Typography.Text>
                </Tooltip>
              </Flex>

              <Flex align="center">
                <Typography.Text
                  style={{
                    fontSize: "10px",
                    color: "var(--font-light-color)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTimeToDateTimeLong(item.complete.start_at)}
                </Typography.Text>
              </Flex>
            </div>
          </Dropdown>
        ))}
    </div>
  );
};

export default HistoryReportList;
