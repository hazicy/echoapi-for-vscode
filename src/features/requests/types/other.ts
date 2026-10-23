import { HookAPI } from '@/shared/ui/base';

import { APIS_TARGET_TYPE_ENUM } from '@/features/requests/constants';

import { ApiDetailsData } from './api';

export type ApisItemActionType = {
  apisData: ApiDetailsData;
  projectId: string;
  childTargetType?: APIS_TARGET_TYPE_ENUM;
  modal?: HookAPI;
  tabsValue?: string;
};

export type CurlDataType = Pick<ApiDetailsData, 'description' | 'method' | 'url'> & {
  request: Pick<ApiDetailsData['request'], 'header' | 'body' | 'query' | 'auth'>;
};
