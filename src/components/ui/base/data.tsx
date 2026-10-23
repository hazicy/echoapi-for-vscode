import slots from "@/components/ui/base/slots.module.css";
import { forwardRef } from "./forwardRef";
import React, { useMemo, useState } from "react";
import RcTable from "rc-table";
import RcTree from "rc-tree";
import RcTreeSelect from "rc-tree-select";
import RcUpload from "rc-upload";
import cx from "classnames";
import { Checkbox, Button } from "./controls";
import type {
  TreeProps,
  TableProps,
  TableColumnType,
  UIProps,
  UploadProps,
  UploadFile,
  RcFile,
} from "./types";
import css from "./base.module.css";
import { getPopupContainer } from "@/utils/popupContainer";
import { useThemeConfig } from "./theme";
const SELECTION_COLUMN = { key: "__selection__" };
export function Table<T extends object = Record<string, unknown>>({
  dataSource = [],
  columns = [],
  rowKey = "key",
  rowSelection,
  pagination = false,
  loading,
  onChange,
  children,
  className,
  rootClassName,
  locale,
  sortDirections,
  showSorterTooltip,
  tableLayout,
  bordered,
  style,
  ...props
}: TableProps<T>) {
  const { components } = useThemeConfig();
  const tableTheme = components?.Table;
  const [selected, setSelected] = useState<React.Key[]>(
    rowSelection?.defaultSelectedRowKeys ?? [],
  );
  const keys: React.Key[] = rowSelection?.selectedRowKeys ?? selected;
  const [page, setPage] = useState(
    pagination ? (pagination.defaultCurrent ?? 1) : 1,
  );
  const [internalPageSize, setInternalPageSize] = useState(
    pagination ? (pagination.defaultPageSize ?? 10) : 10,
  );
  const [sort, setSort] = useState<{ key?: React.Key; order?: string }>({});
  const getKey = (r: T, index = dataSource.indexOf(r)) =>
    typeof rowKey === "function"
      ? rowKey(r, index)
      : (r[rowKey as keyof T] as React.Key);
  const changeSelection = (
    next: React.Key[],
    record?: T,
    checked?: boolean,
  ) => {
    setSelected(next);
    const rows = dataSource.filter((r) => next.includes(getKey(r)));
    rowSelection?.onChange?.(next, rows, { type: "single" });
    if (record) {
      rowSelection?.onSelect?.(record, !!checked, rows);
    }
  };
  const selectable = dataSource.filter(
    (r) => !rowSelection?.getCheckboxProps?.(r)?.disabled,
  );
  const eligible = selectable.map((r) => getKey(r));
  const selection = {
    key: "__selection__",
    width: rowSelection?.columnWidth ?? 36,
    title: rowSelection?.hideSelectAll
      ? rowSelection.columnTitle
      : (rowSelection?.columnTitle ?? (
          <Checkbox
            checked={
              eligible.length > 0 && eligible.every((k) => keys.includes(k))
            }
            indeterminate={
              eligible.some((k) => keys.includes(k)) &&
              !eligible.every((k) => keys.includes(k))
            }
            onChange={(e) => {
              const next = e.target.checked
                ? Array.from(new Set([...keys, ...eligible]))
                : keys.filter((k) => !eligible.includes(k));
              changeSelection(next);
              rowSelection?.onSelectAll?.(
                e.target.checked,
                dataSource.filter((r) => next.includes(getKey(r))),
                selectable,
              );
            }}
          />
        )),
    render: (_: unknown, r: T, index: number) => {
      const disabled = rowSelection?.getCheckboxProps?.(r);
      const checked = keys.includes(getKey(r));
      const field = (
        <Checkbox
          {...disabled}
          checked={checked}
          onChange={(e) =>
            changeSelection(
              rowSelection?.type === "radio"
                ? [getKey(r)]
                : e.target.checked
                  ? [...keys, getKey(r)]
                  : keys.filter((k) => k !== getKey(r)),
              r,
              e.target.checked,
            )
          }
        />
      );
      return rowSelection?.renderCell?.(checked, r, index, field) ?? field;
    },
  };
  let finalColumns: TableColumnType<T>[] = columns.map((col) =>
    col === SELECTION_COLUMN || col.key === "__selection__" ? selection : col,
  );
  if (rowSelection && !finalColumns.some((c) => c.key === "__selection__")) {
    finalColumns = [selection, ...finalColumns];
  }
  const sorted = useMemo(() => {
    const col = columns.find(
      (c) => (c.key ?? String(c.dataIndex)) === sort.key,
    );
    return typeof col?.sorter === "function" && sort.order
      ? [...dataSource].sort(
          (a, b) => col.sorter(a, b) * (sort.order === "ascend" ? 1 : -1),
        )
      : dataSource;
  }, [dataSource, columns, sort]);
  finalColumns = finalColumns.map((col) => ({
    ...col,
    title:
      typeof col.title === "function"
        ? col.title({ sortColumns: sort })
        : col.title,
  }));
  finalColumns = finalColumns.map((col) =>
    !col.sorter
      ? col
      : {
          ...col,
          title: (
            <button
              type="button"
              className={css.sortHeader}
              onClick={() => {
                const key = col.key ?? String(col.dataIndex);
                const order =
                  sort.key === key && sort.order === "ascend"
                    ? "descend"
                    : "ascend";
                setSort({ key, order });
                onChange?.(
                  pagination,
                  {},
                  { ...col, order, columnKey: key },
                  { action: "sort", currentDataSource: sorted },
                );
              }}
            >
              {typeof col.title === "function" ? col.title({}) : col.title} ↕
            </button>
          ),
        },
  );
  const paginationConfig = pagination || {};
  const current = paginationConfig.current ?? page;
  const pageSize = paginationConfig.pageSize ?? internalPageSize;
  const rows = pagination
    ? sorted.slice((current - 1) * pageSize, current * pageSize)
    : sorted;
  const total = paginationConfig.total ?? sorted.length;
  return (
    <div
      className={cx(
        css.table,
        slots["beautify-table-wrapper"],
        bordered && slots["beautify-table-bordered"],
        className,
        rootClassName,
      )}
      aria-busy={!!loading}
      style={
        {
          "--ui-table-header-bg": tableTheme?.headerBg,
          "--ui-table-padding":
            typeof tableTheme?.padding === "number"
              ? `${tableTheme.padding}px`
              : tableTheme?.padding,
          ...style,
        } as React.CSSProperties
      }
    >
      {loading && <div role="status">Loading…</div>}
      <RcTable
        {...props}
        prefixCls="beautify-table"
        className={slots["beautify-table"]}
        tableLayout={tableLayout}
        rowKey={rowKey as any}
        columns={finalColumns as any}
        data={rows}
        emptyText={locale?.emptyText ?? "No data"}
      >
        {children}
      </RcTable>
      {pagination && (
        <nav aria-label="Pagination" className={css.actions}>
          {pagination.showTotal?.(total, [
            (current - 1) * pageSize + 1,
            Math.min(current * pageSize, total),
          ])}
          {pagination.showSizeChanger && (
            <label>
              Page size
              <select
                aria-label="Page size"
                value={pageSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  setInternalPageSize(size);
                  setPage(1);
                  pagination.onChange?.(1, size);
                  pagination.onShowSizeChange?.(1, size);
                }}
              >
                {(pagination.pageSizeOptions ?? [10, 20, 50, 100]).map(
                  (size: number | string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ),
                )}
              </select>
            </label>
          )}
          <Button
            disabled={current <= 1}
            onClick={() => {
              setPage(current - 1);
              pagination.onChange?.(current - 1, pageSize);
              onChange?.(
                { ...pagination, current: current - 1 },
                {},
                {},
                { action: "paginate", currentDataSource: rows },
              );
            }}
          >
            Previous
          </Button>
          <span>
            {current} / {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <Button
            disabled={current * pageSize >= total}
            onClick={() => {
              setPage(current + 1);
              pagination.onChange?.(current + 1, pageSize);
              onChange?.(
                { ...pagination, current: current + 1 },
                {},
                {},
                { action: "paginate", currentDataSource: rows },
              );
            }}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}
Table.SELECTION_COLUMN = SELECTION_COLUMN;
Table.EXPAND_COLUMN = RcTable.EXPAND_COLUMN;
Table.Summary = RcTable.Summary;
Table.Column = RcTable.Column;
Table.ColumnGroup = RcTable.ColumnGroup;
const TreeControl = forwardRef<
  RcTree,
  Omit<React.ComponentProps<typeof RcTree>, "prefixCls"> & {
    prefixCls?: string;
  } & UIProps
>(
  (
    {
      className,
      rootClassName,
      showLine,
      showIcon = true,
      switcherIcon,
      icon,
      ...props
    },
    ref,
  ) => (
    <RcTree
      {...props}
      ref={ref as React.Ref<RcTree<any>>}
      prefixCls="beautify-tree"
      className={cx(css.tree, className, rootClassName)}
      showLine={!!showLine}
      showIcon={showIcon}
      icon={icon}
      switcherIcon={
        switcherIcon ??
        ((node: any) =>
          node.isLeaf || (!props.loadData && !node.children?.length) ? null : (
            <span aria-hidden="true">{node.expanded ? "⌄" : "›"}</span>
          ))
      }
    />
  ),
);
const GenericTree = TreeControl as unknown as <
  T extends import("rc-tree/es/interface").BasicDataNode =
    import("rc-tree/es/interface").DataNode,
>(
  props: TreeProps<T> & React.RefAttributes<RcTree<T>>,
) => React.ReactElement;
export const Tree = Object.assign(GenericTree, {
  DirectoryTree: GenericTree,
  TreeNode: RcTree.TreeNode,
});
export const TreeSelect = Object.assign(
  forwardRef<any, UIProps>(
    (
      { className, rootClassName, popupClassName, dropdownClassName, ...props },
      ref,
    ) => (
      <RcTreeSelect
        getPopupContainer={getPopupContainer}
        {...props}
        ref={ref}
        prefixCls="beautify-select"
        className={cx(css.select, css.treeSelect, slots["beautify-select"], className, rootClassName)}
        dropdownClassName={cx(
          css.popup,
          css.treeSelectPopup,
          css.tree,
          popupClassName,
          dropdownClassName,
        )}
      />
    ),
  ),
  {
    SHOW_ALL: RcTreeSelect.SHOW_ALL,
    SHOW_PARENT: RcTreeSelect.SHOW_PARENT,
    SHOW_CHILD: RcTreeSelect.SHOW_CHILD,
    TreeNode: RcTreeSelect.TreeNode,
  },
);
const IGNORE = Symbol("ignore-upload");
function UploadControl({
  fileList,
  defaultFileList = [],
  onChange,
  beforeUpload,
  onRemove,
  maxCount,
  showUploadList = true,
  className,
  children,
  iconRender,
  ...props
}: UploadProps) {
  const [internal, setInternal] = useState<UploadFile[]>(defaultFileList);
  const files = fileList ?? internal;
  const update = (file: UploadFile) => {
    let list = [...files.filter((f) => f.uid !== file.uid), file];
    if (maxCount) {
      list = list.slice(-maxCount);
    }
    setInternal(list);
    onChange?.({ file, fileList: list });
  };
  return (
    <div className={cx(css.upload, slots["beautify-upload-wrapper"], className)}>
      <RcUpload
        {...props}
        beforeUpload={async (file, list) => {
          const result = await beforeUpload?.(file as RcFile, list as RcFile[]);
          if (result === IGNORE) {
            return false;
          }
          if (result === false) {
            update({
              uid: file.uid,
              name: file.name,
              originFileObj: file as RcFile,
            });
            return false;
          }
          return result as any;
        }}
        onStart={(file) =>
          update({
            uid: file.uid,
            name: file.name,
            originFileObj: file as RcFile,
            status: "uploading",
          })
        }
        onSuccess={(response, file) =>
          update({
            uid: file.uid,
            name: file.name,
            originFileObj: file as RcFile,
            status: "done",
            response,
          })
        }
        onError={(error, response, file) =>
          update({
            uid: file.uid,
            name: file.name,
            originFileObj: file as RcFile,
            status: "error",
            response,
          })
        }
      >
        {children}
      </RcUpload>
      {showUploadList &&
        files.map((file) => (
          <div key={file.uid} className={slots["beautify-upload-list-item"]}>
            {iconRender?.(file)}
            {file.name}
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={async () => {
                if ((await onRemove?.(file)) === false) {
                  return;
                }
                const next = files.filter((f) => f.uid !== file.uid);
                setInternal(next);
                onChange?.({
                  file: { ...file, status: "removed" },
                  fileList: next,
                });
              }}
            >
              ×
            </button>
          </div>
        ))}
    </div>
  );
}
export const Upload = Object.assign(UploadControl, {
  Dragger: ({ children, ...props }: UploadProps) => (
    <UploadControl {...props}>
      <div className={css.dropzone}>{children}</div>
    </UploadControl>
  ),
  LIST_IGNORE: IGNORE,
});
