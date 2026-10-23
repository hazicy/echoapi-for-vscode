import { memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import ResponsePanel from '@/features/requests/components/Response';
import { ApiComponentType, ApiDetailsData } from '@/features/requests/types/api';

import { ResponseContainer } from './style';
import { useApis } from '@/app/store';

const Response = memo((props: ApiComponentType) => {
  const { apisData, onApisDataChange } = props;
  const currentSendingData = useApis(store=>store.currentSendingData);
  const handleOnChange = useMemoizedFn((data: ApiDetailsData['response']) => {
    const newData = produce(apisData, (draft) => {
      draft.response = data;
    });
    onApisDataChange(newData);
  });

  return (
    <ResponseContainer>
      <ResponsePanel
        showDownload
        responseData={apisData.response}
        sendingData={currentSendingData}
        onResponseDataChange={handleOnChange}
      />
    </ResponseContainer>
  );
});

export default Response;
