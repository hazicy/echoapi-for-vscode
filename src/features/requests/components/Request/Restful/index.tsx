import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useMemoizedFn } from "ahooks";
import cn from "classnames";
import produce from "immer";
import { isEqual, size } from "lodash";

import BasicTable from "@/shared/components/BasicTable";
import {
  RowDescription,
  RowKey,
  RowValue,
} from "@/shared/components/RequestTable/components";
import { ApisBaseDataItem } from "@/features/requests/types/base";
import { ApiRequest } from "@/features/requests/types/request";
import { ChangeFuncType } from "@/shared/types/common";

import { RequestTabsItemProps } from "../types";

type Props = RequestTabsItemProps & {
  readOnly?: boolean;
  value: ApiRequest["restful"];
  onChange: ChangeFuncType<ApiRequest>;
};

const RestfulQuery: FC<Props> = memo(
  ({ value, readOnly, onChange }) => {
    const { t } = useTranslation();
    const tableColumns = useMemo(() => {
      const columns = [
        {
          key: "key",
          dataIndex: "key",
          title: t("common.request_table.param_name"),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
            <RowKey
              onChange={handleItemOnChange}
              rowData={record}
              rowIndex={index}
              readOnly={readOnly}
              showCheckbox={false}
              inputDisabled
            />
          ),
        },
        {
          key: "value",
          dataIndex: "value",
          title: t("common.request_table.param_value"),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
            <RowValue
              readOnly={readOnly}
              onChange={handleItemOnChange}
              enableNewRow
              rowData={record}
              rowIndex={index}
              valueSuffix
            />
          ),
        },
        {
          key: "description",
          dataIndex: "description",
          title: t("common.request_table.param_desc"),
          render: (_: string, record: ApisBaseDataItem, index: number) => (
            <RowDescription
              readOnly={readOnly}
              onChange={handleItemOnChange}
              rowData={record}
              rowIndex={index}
              showDelete={false}
              showAiDescription
            />
          ),
        },
      ];

      return columns?.map((it) => ({
        ...it,
        width: `${100 / columns.length}%`,
      }));
    }, [readOnly]);

    const handleItemOnChange = useMemoizedFn(
      (rowIndex: number, rowData: ApisBaseDataItem) => {
        const newDataSource = produce(value, (draft) => {
          draft!.parameter[rowIndex] = rowData;
        });

        onChange?.("restful", newDataSource);
      },
    );

    return (
      <div className={styles.container}>
        <BasicTable
          className={cn({
            [slots["table-custom-empty-wrap"]]: size(value?.parameter) <= 0,
          })}
          rowKey="param_id"
          cellPadding={0}
          columns={tableColumns}
          dataSource={value?.parameter || []}
        />
      </div>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

export default RestfulQuery;
