import { TabsProps } from '@/shared/ui/base';

import { ApisBaseDataItem } from '@/features/requests/types/base';
import { ApiRequest } from '@/features/requests/types/request';
import { ApiDetailsData } from '@/features/requests/types/api';
import { GlobalParamsHeaderItem } from '@/features/project/types';

export interface RequestProps {
  target_id?: string;
  paramsType?: 'global' | 'folder' | 'request' | '';
  onlyAssert?: boolean;
  tabsDefaultActiveKey?: string;
  showAiDescription?: boolean;
  extra?: TabsProps['items'];
  includesTabs?: string[];
  requestData: Partial<ApiRequest>;
  apiData?:ApiDetailsData;
  isSystem?: boolean;
  onRequestDataChange: (requestData: Partial<ApiRequest>) => void;
}

export type RequestTabsItemProps = Pick<RequestProps, 'paramsType'> & {
  tabType?: 'header' | 'query' | 'restful' | 'body' | 'cookie' | 'event';
  folderParams?: ApisBaseDataItem[];
  globalParams?: GlobalParamsHeaderItem[];
};
