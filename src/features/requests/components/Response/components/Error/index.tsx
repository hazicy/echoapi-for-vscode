import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

import IconFont from "@/shared/ui/IconFont";

import { openUrl } from "@/shared/utils/open";

interface ResponseErrorProps {
  errorMessage: string;
  onClose?: (string: "none") => void;
}

const ResponseError: React.FC<ResponseErrorProps> = (props) => {
  const { t } = useTranslation();
  const { errorMessage, onClose } = props;

  // proxy error
  const isRenderErrorMessage = (message: string) => {
    return /connect ECONNREFUSED/.test(message);
  };

  const handleClose = () => {
    onClose?.("none");
  };

  return (
    <div className={styles.container}>
      {onClose && (
        <IconFont
          type="icon-error"
          className={slots["close-error-wrapper"]}
          onClick={handleClose}
        />
      )}
      <div className={slots.container}>
        {t("supplement.intro_script")}
        <p className={slots["error-str"]}>{errorMessage}</p>
        {isRenderErrorMessage(errorMessage) && (
          <p className={[slots["error-str"], slots["proxy-error"]].join(" ")}>
            {t("supplement.proxy_sys_tip")}
          </p>
        )}
        <p className="err-desc-go-index">
          {t("supplement.go")}&nbsp;
          <span onClick={() => openUrl("https://www.echoapi.com/")}>
            https://www.echoapi.com/
          </span>
          &nbsp;{t("supplement.proxy_sys_tip1")}
        </p>
      </div>
    </div>
  );
};

export default ResponseError;
