import { FC, memo } from 'react';

import Console from '@/features/requests/components/Console';
import { useApis } from '@/app/store';
import { ApiSendingData } from '@/features/requests/types/send';

import { ResponseConsoleContainer } from './style';

interface Props {
  sendingData?: Partial<ApiSendingData>;
}

const ResponseConsole: FC<Props> = memo(({ sendingData }) => {
  const coverApiSendingConsole = useApis((state) => state.coverApiSendingConsole);

  const handleClear = () => {
    coverApiSendingConsole({ consoleList: [], target_id: sendingData?.target_id });
  };

  return (
    <ResponseConsoleContainer>
      <Console consoleList={sendingData?.consoleList || []} onClear={handleClear} />
    </ResponseConsoleContainer>
  );
});

export default ResponseConsole;
