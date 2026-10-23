import type * as React from "react";
export type { FormInstance } from "rc-field-form";
export type { DataNode } from "rc-tree/es/interface";
import type { TreeProps as RcTreeProps } from "rc-tree";
import type {
  BasicDataNode,
  DataNode as RcDataNode,
} from "rc-tree/es/interface";
export type TreeProps<T extends BasicDataNode = RcDataNode> = Omit<
  RcTreeProps<T>,
  "prefixCls"
> & { prefixCls?: string; blockNode?: boolean };
export type { ThemeConfig } from "./Theme";
export type { DrawerProps } from "../Drawer";
export type GetProps<T> = T extends React.ComponentType<infer P> ? P : never;
export interface UIProps {
  children?: React.ReactNode;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onKeyDown?: (...args: any[]) => any;
  onKeyUp?: (...args: any[]) => any;
  onMouseDown?: (...args: any[]) => any;
  onMouseUp?: (...args: any[]) => any;
  onMouseEnter?: (...args: any[]) => any;
  onMouseLeave?: (...args: any[]) => any;
  onOpenChange?: (...args: any[]) => any;
  onConfirm?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  onSelect?: (...args: any[]) => any;
  onDeselect?: (...args: any[]) => any;
  onSearch?: (...args: any[]) => any;
  onExpand?: (...args: any[]) => any;
  onDropdownVisibleChange?: (...args: any[]) => any;
  onValuesChange?: (...args: any[]) => any;
  filterTreeNode?: (...args: any[]) => any;
  expandIcon?: (...args: any[]) => any;
  dropdownRender?: (...args: any[]) => any;
  popupRender?: (...args: any[]) => any;
  titleRender?: (...args: any[]) => any;
  getPopupContainer?: (...args: any[]) => any;
  onPressEnter?: (...args: any[]) => any;
  [prop: string]: any;
}
export interface Option extends UIProps {
  value?: string | number | boolean;
  label?: React.ReactNode;
  options?: Option[];
}
export interface ButtonProps extends UIProps {
  type?: "default" | "primary" | "text" | "link" | "dashed";
  htmlType?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLElement>;
  loading?: boolean | { delay?: number };
}
export interface InputRef {
  input: HTMLInputElement | null;
  focus(options?: FocusOptions & { cursor?: "start" | "end" | "all" }): void;
  blur(): void;
  select(): void;
}
export interface InputProps extends UIProps {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}
export interface TextAreaProps extends UIProps {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}
export interface SelectProps<
  V = any,
  O extends Option = Option,
> extends UIProps {
  popupArrow?: boolean;
  popupAnchor?: React.RefObject<HTMLElement | null>;
  popupSideOffset?: number;
  popupArrowStyle?: React.CSSProperties;
  options?: O[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V, option: O | O[]) => void;
  onSelect?: (value: any, option: O) => void;
  labelRender?: (props: {
    label: React.ReactNode;
    value: any;
  }) => React.ReactNode;
  optionRender?: (
    option: O & { data: O },
    info: { index: number },
  ) => React.ReactNode;
  filterOption?: boolean | ((input: string, option: O) => boolean);
  onSearch?: (text: string) => void;
  mode?: "multiple" | "tags";
}
export interface InputNumberProps<V = number> extends UIProps {
  value?: V | null;
  defaultValue?: V;
  onChange?: (value: V | null) => void;
}
export interface CheckboxProps extends UIProps {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: any;
  onChange?: (event: CheckboxChangeEvent) => void;
}
export interface CheckboxChangeEvent {
  target: { checked: boolean; value?: any };
  nativeEvent: Event;
  stopPropagation(): void;
  preventDefault(): void;
}
export type RadioChangeEvent = CheckboxChangeEvent;
export type RadioProps = CheckboxProps;
export type RadioGroupProps = UIProps & {
  options?: (Option | string | number)[];
  value?: any;
  defaultValue?: any;
  onChange?: (e: RadioChangeEvent) => void;
};
export type SwitchProps = UIProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: Event) => void;
};
export type MenuProps = UIProps & {
  items?: MenuItemProps[];
  onClick?: (info: {
    key: string;
    domEvent: React.MouseEvent;
    keyPath: string[];
  }) => void;
};
export interface MenuItemProps extends Omit<UIProps, "children"> {
  key?: React.Key;
  label?: React.ReactNode;
  type?: string;
  onClick?: MenuProps["onClick"];
  children?: MenuItemProps[] | null;
}
export type ItemType = MenuItemProps;
export type TooltipProps = UIProps & {
  title?: React.ReactNode | (() => React.ReactNode);
};
export type PopoverProps = TooltipProps & {
  content?: React.ReactNode | (() => React.ReactNode);
};
export type DropdownProps = UIProps & { menu?: MenuProps };
export type CollapseProps = UIProps & {
  items?: (UIProps & { key?: React.Key; label?: React.ReactNode })[];
};
export type TabsProps = UIProps & {
  items?: (UIProps & { key: string; label: React.ReactNode })[];
};
export type TabPaneProps = UIProps & { tab?: React.ReactNode; tabKey?: string };
export type SegmentedProps<V = string | number> = UIProps & {
  options?: (Option | V)[];
  value?: V;
  onChange?: (value: V) => void;
};
export type SkeletonProps = UIProps;
export type TagProps = UIProps;
export type AlertProps = UIProps;
export type EmptyProps = UIProps;
export type TreeSelectProps<V = any> =
  import("rc-tree-select").TreeSelectProps<V> & { rootClassName?: string };
export interface TableColumnType<T = any> extends Omit<UIProps, "children"> {
  key?: React.Key;
  title?: React.ReactNode | ((props: any) => React.ReactNode);
  dataIndex?: string | number | (string | number)[];
  render?: (value: any, record: T, index: number) => React.ReactNode;
  children?: TableColumnType<T>[];
}
export type TableColumnsType<T = any> = TableColumnType<T>[];
export type TableProps<T = any> = UIProps & {
  dataSource?: T[];
  columns?: TableColumnType<T>[];
  rowKey?: string | ((record: T, index: number) => React.Key);
  components?: any;
  rowSelection?: {
    selectedRowKeys?: React.Key[];
    defaultSelectedRowKeys?: React.Key[];
    onChange?(keys: React.Key[], rows: T[], info: any): void;
    renderCell?: (
      checked: boolean,
      record: T,
      index: number,
      node: React.ReactNode,
    ) => React.ReactNode;
    getCheckboxProps?: (record: T) => any;
    onSelect?: (record: T, selected: boolean, rows: T[]) => void;
    [key: string]: any;
  };
  pagination?:
    | false
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        showTotal?: (total: number, range: [number, number]) => React.ReactNode;
        onChange?: (page: number, pageSize: number) => void;
        [key: string]: any;
      };
};
export type RcFile = File & { uid: string; lastModifiedDate?: Date };
export type UploadFileStatus = "error" | "done" | "uploading" | "removed";
export interface UploadFile<T = any> {
  uid: string;
  name: string;
  status?: UploadFileStatus;
  size?: number;
  type?: string;
  originFileObj?: RcFile;
  response?: T;
  url?: string;
  percent?: number;
}
export type UploadChangeParam<T = UploadFile> = {
  file: T;
  fileList: T[];
  event?: { percent: number };
};
export interface UploadProps extends UIProps {
  beforeUpload?: (file: RcFile, files: RcFile[]) => unknown;
  onChange?: (info: UploadChangeParam) => void;
  fileList?: UploadFile[];
}
export type ModalProps = UIProps & {
  open?: boolean;
  title?: React.ReactNode;
  onOk?: (event?: any) => void | Promise<unknown>;
  onCancel?: (event?: any) => void;
};
export type ModalFuncProps = ModalProps & { content?: React.ReactNode };
export interface ModalHandle extends PromiseLike<boolean> {
  destroy(): void;
  update(config: Partial<ModalFuncProps>): void;
}
export interface ModalStaticFunctions {
  confirm(config: ModalFuncProps): ModalHandle;
  info(config: ModalFuncProps): ModalHandle;
  success(config: ModalFuncProps): ModalHandle;
  error(config: ModalFuncProps): ModalHandle;
  warning(config: ModalFuncProps): ModalHandle;
  warn(config: ModalFuncProps): ModalHandle;
}
export type HookAPI = ModalStaticFunctions;
export interface MessageInstance {
  success(
    content: React.ReactNode | UIProps,
    duration?: number,
    onClose?: () => void,
  ): () => void;
  error: MessageInstance["success"];
  warning: MessageInstance["success"];
  info: MessageInstance["success"];
  loading: MessageInstance["success"];
  open(config: UIProps): () => void;
  destroy(key?: React.Key): void;
}
export interface NotificationInstance {
  success(config: UIProps): void;
  error(config: UIProps): void;
  info(config: UIProps): void;
  warning(config: UIProps): void;
  open(config: UIProps): void;
  destroy(key?: React.Key): void;
}
