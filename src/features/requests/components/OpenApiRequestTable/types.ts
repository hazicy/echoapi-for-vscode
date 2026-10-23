import { ParametersItem } from '@/features/requests/types/api';
import { ApisBaseDataItem } from '@/features/requests/types/base';
import { RequestBodyContentType } from '@/features/requests/types/request';
import { CustomNumberBooleanType } from '@/shared/types/common';
import { GlobalParamsHeaderItem } from '@/features/project/types';

export type Item = {
  description: string;
  field_type: string;
  is_checked: -1 | 1;
  key: string;
  value: string;
  not_null: -1 | 1;
  type?: string;
  id: number;
};

export type ItemProps = {
  rowData: ParametersItem;
  rowIndex: number;
  readOnly?: boolean;
  enableNewRow?: boolean;
  tabType?: RequestTableProps['tabType'];
  bodyMode?: RequestTableProps['bodyMode'];
  setSelectedRowKeys?: (keys: string[]) => void;
  onChange?: (rowIndex: number, rowData: ParametersItem) => void;
  onDelete?: (rowIndex: number) => void;
};

export interface RequestTableProps {
  dataSource: ParametersItem[];
  globalParams?: GlobalParamsHeaderItem[];
  folderParams?: ParametersItem[];
  queryAddEqual?: CustomNumberBooleanType;
  paramsType?: 'global' | 'folder' | 'request' | '';
  tabType?: 'header' | 'query' | 'restful' | 'body' | 'cookie' | 'event';
  readOnly?: boolean;
  bodyMode?: RequestBodyContentType;
  isSystem?: boolean;
  showAiDescription?: boolean;
  onChange: (params: ParametersItem[]) => void;
  onChangeQueryAddEqual?: (params: CustomNumberBooleanType) => void;
  columnSwitchConfig?: TableColumnSwitchConfig;
  onColumnSwitchConfig?: (params: TableColumnSwitchConfig) => void;
}

/**Table column configuration items */
export type TableColumnSwitchConfig = {
  /**Parameter description toggle */
  parameter_description: CustomNumberBooleanType;
  /**Parameter type toggle */
  parameter_type: CustomNumberBooleanType;
  /**Content type toggle */
  content_type: CustomNumberBooleanType;
};