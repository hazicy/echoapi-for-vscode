import styles from "../style.module.css";
import classNames from "classnames";
import slots from "@/shared/ui/base/slots.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

import { Space } from "@/shared/ui/base";

import IconFont from "@/shared/ui/IconFont";

interface BodyListProps {
  isSuccess: boolean;
  errList: any[];
}

const BodyList: React.FC<BodyListProps> = (props) => {
  const { isSuccess, errList } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.bodyList}>
      <div className="assert-list">
        {errList?.map((item, index) => (
          <span
            key={index}
            data-passed={Boolean(item.status)}
            className={classNames(
              styles.responseAssertItem,
              slots["content-item"],
            )}
          >
            <Space>
              {item.status === "success" ? (
                <IconFont type="icon-checked" />
              ) : (
                <IconFont type="icon-error" />
              )}
              {item.expect}
            </Space>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BodyList;
