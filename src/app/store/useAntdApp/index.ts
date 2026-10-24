import {
  message as messageApi,
  notification as notificationApi,
  modal as modalApi,
} from "@/shared/ui/base/Feedback";
import type { MessageInstance } from "@/shared/ui/base";
import type { ModalStaticFunctions } from "@/shared/ui/base";
import type { NotificationInstance } from "@/shared/ui/base";

import { create } from "zustand";

type State = {
  message?: MessageInstance;
  notification?: NotificationInstance;
  modal?: Omit<ModalStaticFunctions, "warn">;
};

type Action = {
  updateAntdStaticFunctions: (staticFunctions: {
    message: MessageInstance;
    notification: NotificationInstance;
    modal: Omit<ModalStaticFunctions, "warn">;
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
