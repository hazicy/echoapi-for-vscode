import { FC } from 'react';

import { AlertProps } from '@/shared/ui/base';

import { AlertTextWrap } from './style';

const AlertText: FC<AlertProps> = (props) => {
  return <AlertTextWrap {...props}></AlertTextWrap>;
};
export default AlertText;
