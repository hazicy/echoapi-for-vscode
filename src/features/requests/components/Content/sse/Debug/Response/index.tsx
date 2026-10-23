import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useMemoizedFn } from 'ahooks';
import produce from 'immer';

import ResponsePanel from '@/features/requests/components/Response';
import { useApis } from '@/app/store';
import { ApiComponentType, ApiDetailsData } from '@/features/requests/types/api';

import Realtime from './components/Realtime';

import { ResponseContainer } from './style';

const Response = memo((props: ApiComponentType) => {
  const { apisData, onApisDataChange } = props;
  const { t } = useTranslation();

  const curApiSendingDataSSE = useApis((state) => state.currentSseSendingData);

  const showResponseSize = useMemo(() => {
    return (
      curApiSendingDataSSE?.sendStatus !== 'sending' &&
      !!curApiSendingDataSSE?.streamResponse &&
      !!curApiSendingDataSSE?.response
    );
  }, [curApiSendingDataSSE]);

  const extraBeforeItem = [
    {
      key: 'customRealtime',
      label: t('api.run.response_tab'),
      children: <Realtime sendingDataSSE={curApiSendingDataSSE} />,
    },
  ];

  const handleOnChange = useMemoizedFn((data: ApiDetailsData['response']) => {
    const newData = produce(apisData, (draft) => {
      draft.response = data;
    });

    onApisDataChange(newData);
  });

  return (
    <ResponseContainer>
      <ResponsePanel
        onlySendingLoadingBar
        sendAfterResponseToTabDisabled
        showResponseSize={showResponseSize}
        showExampleImport={false}
        extra={extraBeforeItem}
        responseData={apisData.response}
        sendingData={curApiSendingDataSSE}
        tabsDefaultActiveKey="customRealtime"
        includesTabs={[
          'customRealtime',
          'requestHeader',
          'responseHeader',
          'cookie',
          'responseExample',
          'realRequest',
          'console',
        ]}
        onResponseDataChange={handleOnChange}
      />
    </ResponseContainer>
  );
});

export default Response;
