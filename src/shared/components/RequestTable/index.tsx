import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, lazy, memo, Suspense, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { CheckboxProps, Flex } from "@/shared/ui/base";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMemoizedFn, useSafeState } from "ahooks";

import { snowflakeId } from "apipost-tools";
import produce from "immer";
import {
  cloneDeep,
  every,
  filter,
  forEach,
  isArray,
  isEqual,
  isNull,
  last,
  size,
  some,
} from "lodash";

import BasicTable from "@/shared/components/BasicTable";
import { PARAMETER_ITEM } from "@/features/requests/constants/request";
import { STATUS_CODE } from "@/shared/constants/common";
import { ApisBaseDataItem } from "@/features/requests/types/base";

import {
  RowContentType,
  RowDescription,
  RowDescriptionTitle,
  RowKey,
  RowKeyTitle,
  RowValue,
} from "./components";

import Listen from "./components/Listen";
import { PARAMETER_TYPE, RequestTableProps } from "./types";

import PublicParamsTable from "./components/PublicParamsTable";
import ColumnConfig from "./components/ColumnConfig";
import { IconFont } from "@/shared/ui";
const ParameterConversion = lazy(() => import("../ParameterConversion"));

const RequestTable: FC<RequestTableProps> = memo(
  ({
    dataSource = [],
    globalParams = [],
    folderParams = [],
    onChange,
    paramsType,
    tabType,
    onChangeQueryAddEqual,
    queryAddEqual,
    readOnly,
    bodyMode,
    showAiDescription = true,
    isSystem = false,
    columnSwitchConfig,
    onColumnSwitchConfig,
    showDelete = true,
    target_type,
  }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useSafeState(false);
    const [parameterType, setParameterType] = useSafeState<PARAMETER_TYPE>(
      PARAMETER_TYPE.EXPORT,
    );
    const lastRowDataRef = useRef<ApisBaseDataItem | null>(null);

    const tableDataList = useMemo(() => {
      if (!isArray(dataSource)) {
        PARAMETER_ITEM.param_id = snowflakeId();

        return [{ ...PARAMETER_ITEM }];
      }

      const hasStatic = dataSource?.some((item) => item?.static);

      if (!hasStatic) {
        // Record the last row data to avoid duplicate generation of new param_id, causing unnecessary refresh
        const usedLastRowData =
          isNull(lastRowDataRef.current) ||
          isEqual(last(dataSource)?.param_id, lastRowDataRef.current?.param_id);

        if (usedLastRowData) {
          PARAMETER_ITEM.param_id = snowflakeId();
          lastRowDataRef.current = PARAMETER_ITEM;

          return [...dataSource, PARAMETER_ITEM];
        }

        return [...dataSource, lastRowDataRef.current as ApisBaseDataItem];
      }

      return dataSource;
    }, [dataSource, dataSource.length]);

    const allCheckboxStatus = useMemo(() => {
      const status = {
        checked: false,
        indeterminate: false,
      };

      // None selected
      if (
        size(dataSource) > 0 &&
        every(dataSource, (item) => item?.is_checked === STATUS_CODE.DISABLE)
      ) {
        return status;
      }

      // All selected
      if (
        every(dataSource, (item) => item?.is_checked === STATUS_CODE.ENABLE)
      ) {
        status.checked = true;
      }

      // Partially selected
      if (
        some(dataSource, (item) => item?.is_checked === STATUS_CODE.DISABLE)
      ) {
        status.indeterminate = true;
      }

      return status;
    }, [dataSource]);

    const handleCheckAll: CheckboxProps["onChange"] = useMemoizedFn((event) => {
      const newDataSource = produce(dataSource, (draft) => {
        forEach(draft, (item) => {
          item.is_checked = event.target.checked
            ? STATUS_CODE.ENABLE
            : STATUS_CODE.DISABLE;
        });
      });

      onChange?.(newDataSource);
    });

    const handleItemOnChange = useMemoizedFn(
      (rowIndex: number, rowData: ApisBaseDataItem) => {
        const newDataSource = produce(
          dataSource,
          (draft: ApisBaseDataItem[]) => {
            draft[rowIndex] = rowData;

            // Key and value must not be empty, and not in read-only mode, to allow adding new rows
            if ((rowData?.key || rowData?.value) && !readOnly) {
              delete draft[rowIndex].static;
            }
          },
        );

        onChange?.(newDataSource);
      },
    );

    const onDelete = useMemoizedFn((rowIndex: number) => {
      const newDataSource = produce(dataSource, (draft: ApisBaseDataItem[]) => {
        draft.splice(rowIndex, 1);
      });

      onChange?.(newDataSource);
    });

    const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        const _dataSource = cloneDeep(dataSource);
        const activeIndex = _dataSource.findIndex(
          (i) => i.param_id === active.id,
        );
        const overIndex = _dataSource.findIndex((i) => i.param_id === over?.id);
        const newDataSource = arrayMove(_dataSource, activeIndex, overIndex);

        onChange?.(newDataSource);
      }
    };
    const handleAiModal = () => {};

    const rowKeyRender = (
      _: string,
      record: ApisBaseDataItem,
      index: number,
    ) => (
      <RowKey
        readOnly={readOnly}
        tabType={tabType}
        bodyMode={bodyMode}
        onChange={handleItemOnChange}
        rowData={record}
        rowIndex={index}
        showCheckbox={!isEqual(tabType, "socketio")}
        showAiDescription={showAiDescription}
        showFieldType={
          !isEqual(columnSwitchConfig?.parameter_type, STATUS_CODE.DISABLE)
        }
      />
    );

    const rowKeyTitleRender = () => (
      <RowKeyTitle
        tabType={tabType}
        queryAddEqual={queryAddEqual}
        allCheckboxStatus={allCheckboxStatus}
        handleCheckAll={handleCheckAll}
        onChangeQueryAddEqual={onChangeQueryAddEqual}
      />
    );

    const rowValueRender = (
      _: string,
      record: ApisBaseDataItem,
      index: number,
    ) => (
      <>
        {isEqual(tabType, "socketio") ? (
          <Listen
            readOnly={readOnly}
            onChange={handleItemOnChange}
            tabType={tabType}
            rowData={record}
            rowIndex={index}
            bodyMode={bodyMode}
            valueSuffix
          />
        ) : (
          <RowValue
            readOnly={readOnly}
            onChange={handleItemOnChange}
            tabType={tabType}
            rowData={record}
            rowIndex={index}
            bodyMode={bodyMode}
            valueSuffix
          />
        )}
      </>
    );

    const rowDescriptionTitleRender = () => (
      <RowDescriptionTitle
        onAiModal={handleAiModal}
        tabType={tabType}
        setOpen={setOpen}
      />
    );

    const rowDescriptionRender = (
      _: string,
      record: ApisBaseDataItem,
      index: number,
    ) => (
      <RowDescription
        readOnly={readOnly}
        onChange={handleItemOnChange}
        onDelete={onDelete}
        rowData={record}
        rowIndex={index}
        showAiDescription={showAiDescription}
        showDelete={false}
      />
    );

    const rowContentTypeRender = (
      _: string,
      record: ApisBaseDataItem,
      index: number,
    ) => (
      <RowContentType
        readOnly={readOnly}
        onChange={handleItemOnChange}
        enableNewRow
        rowData={record}
        rowIndex={index}
      />
    );

    const tableColumns = () => {
      const columns = [
        {
          key: "key",
          dataIndex: "key",
          title: rowKeyTitleRender,
          render: rowKeyRender,
        },
        {
          key: "value",
          dataIndex: "value",
          title: isEqual(tabType, "socketio")
            ? t("supplement.listen")
            : t("common.request_table.param_value"),
          render: rowValueRender,
        },
        {
          key: "description",
          dataIndex: "description",
          title: rowDescriptionTitleRender,
          render: rowDescriptionRender,
          hidden: isEqual(
            columnSwitchConfig?.parameter_description,
            STATUS_CODE.DISABLE,
          ),
        },
      ];

      if (isEqual(tabType, "event")) {
        columns.splice(1, 1);
      }

      if (isEqual(bodyMode, "form-data")) {
        columns.splice(2, 0, {
          key: "content_type",
          dataIndex: "content_type",
          title: () => (
            <Flex
              align="center"
              justify="space-between"
              style={{ minWidth: 175 }}
            >
              {t("common.request_table.content_type")}
            </Flex>
          ),
          render: rowContentTypeRender,
        });
      }
      const filterColumns = filter(
        columns,
        (filterItem) => !filterItem?.hidden,
      );
      return filterColumns?.map((colItem, colIndex) => ({
        ...colItem,
        ...(!isEqual(colIndex, size(filterColumns) - 1)
          ? { width: 320 }
          : {
              render: (text: string, record: ApisBaseDataItem, index: number) =>
                lastColumnRender(text, record, index, colItem),
            }),
      }));
    };

    const parameterChange = (value: ApisBaseDataItem[]) => {
      onChange?.(value);
      setOpen(false);
    };

    const lastColumnRender = (
      _: string,
      record: ApisBaseDataItem,
      index: number,
      colItem: any,
    ) => (
      <Flex align="center" style={{ height: "100%", width: "100%" }}>
        <Flex flex={1}>{colItem?.render(_, record, index)}</Flex>
        <Flex
          className={slots["row-description-operation"]}
          style={{ height: "100%", padding: "0 8px" }}
          align="center"
          gap={12}
        >
          {showDelete && (
            <IconFont
              type="icon-delete"
              className={slots["delete-params-icon"]}
              onClick={() => onDelete?.(index)}
            />
          )}
        </Flex>
      </Flex>
    );

    return (
      <div className={styles.requestTable}>
        <PublicParamsTable
          target_type={target_type}
          tabType={tabType}
          isSystem={isSystem}
          paramsType={paramsType}
          globalParams={globalParams}
          folderParams={folderParams}
          columnSwitchConfig={columnSwitchConfig}
        />
        <div className={styles.basicTable}>
          <BasicTable
            tableLayout="fixed"
            rowKey="param_id"
            dragEnable
            cellPadding={0}
            dragLastDisabled
            resizableColEnable
            dataSource={tableDataList}
            columns={tableColumns()}
            onDragEnd={onDragEnd}
          />
          <ColumnConfig
            onAiModal={handleAiModal}
            tabType={tabType}
            setParameterType={setParameterType}
            setOpen={setOpen}
            bodyMode={bodyMode}
            columnSwitchConfig={columnSwitchConfig}
            onColumnSwitchConfig={onColumnSwitchConfig}
          />
        </div>
        {open && (
          <Suspense fallback={null}>
            <ParameterConversion
              value={dataSource}
              onCancel={() => setOpen(false)}
              parameterType={parameterType}
              open={open}
              onChange={parameterChange}
            />
          </Suspense>
        )}
      </div>
    );
  },
);

export default RequestTable;
