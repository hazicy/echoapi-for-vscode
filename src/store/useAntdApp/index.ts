import { message as messageApi, notification as notificationApi, modal as modalApi } from '@/components/ui/base/feedback';
import type { MessageInstance } from '@/components/ui/base';
import type { ModalStaticFunctions } from '@/components/ui/base';
import type { NotificationInstance } from '@/components/ui/base';

import { create } from 'zustand';

type State = {
  message?: MessageInstance;
  notification?: NotificationInstance;
  modal?: Omit<ModalStaticFunctions, 'warn'>;
};

type Action = {
  updateAntdStaticFunctions: (staticFunctions: {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: Omit<ModalStaticFunctions, 'warn'>;
  }) => void;
};

const useAntdApp = create<State & Action>()((set) => ({
  message: messageApi,
  modal: modalApi,
  notification: notificationApi,
  updateAntdStaticFunctions: (staticFunctions) =>
    set({
      message: staticFunctions.message,
      notification: staticFunctions.notification,
      modal: staticFunctions.modal,
    }),
}));

export default useAntdApp;
