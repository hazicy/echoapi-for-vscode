import { FC } from 'react';

import { AlertProps } from '@/components/ui/base';

import { AlertTextWrap } from './style';

const AlertText: FC<AlertProps> = (props) => {
  return <AlertTextWrap {...props}></AlertTextWrap>;
};
export default AlertText;
