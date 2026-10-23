import { ApiSendResponseData } from '@/features/requests/types/send';

export type ConsoleContentProps = {
  consoleList: ApiSendResponseData['console'];
  onClear?: () => void;
};
