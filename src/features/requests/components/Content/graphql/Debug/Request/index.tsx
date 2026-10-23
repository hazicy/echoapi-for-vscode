import { memo, ReactNode } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import GraphQLQuery from '@/features/requests/components/GraphQLQuery';

import context from '@/shared/components/RawEditor/visualizationContext';
import RequestPanel from '@/features/requests/components/Request';
import { ApiComponentType, GraphQLChangeFuncType, GraphQLDetailsData } from '@/features/requests/types/graphql';
import { ApiRequest } from '@/features/requests/types/request';
import { DirectionType } from '@/shared/types/common';

import { RequestContainer } from './style';

const Request = memo((props: ApiComponentType & { direction: DirectionType;tabBarExtraContent?: ReactNode }) => {
  const { direction, apisData, onApisDataChange, tabBarExtraContent } = props;
  const { Provider } = context;

  const handleOnChange: GraphQLChangeFuncType<GraphQLDetailsData> = useMemoizedFn(
    (key, data, search_id) => {
      const newData = produce(apisData, (draft) => {
        draft[key] = data;
        if (search_id) {
          draft.search_id = search_id as string;
        }
      });

      onApisDataChange(newData);
    }
  );

  const extra = [
    {
      key: 'cusQuery',
      label: 'Query',
      children: (
        <GraphQLQuery
          target_id={apisData?.target_id}
          requestData={apisData.request}
          apiData={apisData}
          onChange={handleOnChange}
        />
      ),
    },
  ];

  return (
    <RequestContainer $direction={direction}>
      <Provider
        value={{
          isDebugArea: true,
        }}
      >
        <RequestPanel
          extra={extra}
          includesTabs={['cusQuery', 'Headers', 'Auth' ,'Cookie', 'preRequest', 'postResponse']}
          target_id={apisData?.target_id}
          requestData={apisData.request as unknown as Partial<ApiRequest>}
          onRequestDataChange={(v) => handleOnChange('request', v as any)}
          tabBarExtraContent={tabBarExtraContent}
        />
      </Provider>
    </RequestContainer>
  );
});

export default Request;
