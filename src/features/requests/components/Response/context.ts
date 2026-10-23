import { createContext } from 'react';

import { ApiSendingData } from '@/features/requests/types/send';

type Props = {
  responseData: any;
  sendingData: Partial<ApiSendingData>;
  onResponseDataChange: (responseData: any) => void;
};

const Context = createContext<Props>({
  responseData: {},
  sendingData: {},
  onResponseDataChange: () => {},
});

export default Context;
