import styles from "../style.module.css";
import classNames from "classnames";
import slots from "@/shared/ui/base/slots.module.css";
import React from "react";

import { isEqual, isUndefined } from "lodash";

import { ApiSendingData } from "@/features/requests/types/send";

type Props = {
  sendingData: Partial<ApiSendingData>;
};

const ScriptError: React.FC<Props> = (props) => {
  const { sendingData } = props;

  if (
    isUndefined(sendingData?.responseError?.message) ||
    !isEqual(sendingData?.responseError?.error_type, "test")
  ) {
    return null;
  }

  return (
    <div className={classNames(styles.scriptError, slots["content-item"])}>
      <span className={slots["runtime-script-error"]}>
        {sendingData?.responseError?.message}
      </span>
    </div>
  );
};

export default ScriptError;
