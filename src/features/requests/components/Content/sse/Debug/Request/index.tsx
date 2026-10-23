import { memo, ReactNode } from 'react';

import { useMemoizedFn } from 'ahooks';

import context from '@/shared/components/RawEditor/visualizationContext';
import RequestPanel from '@/features/requests/components/Request';
import { ApiComponentType, ApiDetailsData } from '@/features/requests/types/api';
import { DirectionType } from '@/shared/types/common';

import { RequestContainer } from './style';
import { ApiRequest } from '@/features/requests/types/request';

const Request = memo((props: ApiComponentType & {tabOptions?:any; direction: DirectionType;tabBarExtraContent?: ReactNode; onRequestDataChange:(requestData: Partial<ApiRequest>) => void; }) => {
  const { tabBarExtraContent,direction, tabOptions = {},apisData, onApisDataChange, onRequestDataChange } = props;
  const { Provider } = context;

  const handleOnChange = useMemoizedFn((data: ApiDetailsData['request']) => {
    onRequestDataChange(data);
  });

  return (
    <RequestContainer $direction={direction}>
      <Provider
        value={{
          isDebugArea: true,
        }}
      >
        <RequestPanel
          tabOptions={tabOptions}
          tabBarExtraContent={tabBarExtraContent}
          includesTabs={['Headers', 'Params', 'Path', 'Body', 'Auth', 'Cookie', 'preRequest']}
          target_id={apisData?.target_id}
          tabsDefaultActiveKey={apisData.request?.tabs_default_active_key || 'body'}
          requestData={apisData.request}
          onRequestDataChange={handleOnChange}
        />
      </Provider>
    </RequestContainer>
  );
});

export default Request;
