import slots from "@/components/ui/base/slots.module.css";
import React from 'react';

import { isEqual, isUndefined } from 'lodash';

import { ApiSendingData } from '@/types/apis/send';

import { ScriptErrorContainer } from '../style';

type Props = {
  sendingData: Partial<ApiSendingData>;
};

const ScriptError: React.FC<Props> = (props) => {
  const { sendingData } = props;

  if (
    isUndefined(sendingData?.responseError?.message) ||
    !isEqual(sendingData?.responseError?.error_type, 'test')
  ) {
    return null;
  }

  return (
    <ScriptErrorContainer>
      <span className={slots["runtime-script-error"]}>{sendingData?.responseError?.message}</span>
    </ScriptErrorContainer>
  );
};

export default ScriptError;
