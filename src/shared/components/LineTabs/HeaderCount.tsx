import styles from "./style.module.css";
import { FC, useMemo } from "react";

import { isArray, isPlainObject, keys, size } from "lodash";

import slots from "@/shared/ui/base/slots.module.css";

interface Props {
  dataSource?: any;
  showDot?: boolean;
  customCalcFun?: (dataSource: any) => number;
  label: any;
}

const HeaderCount: FC<Props> = ({
  label,
  dataSource,
  showDot = false,
  customCalcFun,
}) => {
  const calcCount = useMemo(() => {
    if (showDot) {
      return 0;
    }

    if (customCalcFun) {
      return customCalcFun(dataSource);
    }

    if (isPlainObject(dataSource)) {
      const number = size(keys(dataSource));
      return number;
    }

    if (isArray(dataSource)) {
      return size(dataSource);
    }
  }, [dataSource, customCalcFun, showDot]);

  if (showDot) {
    return (
      <span className={styles.tabsHeaderCount}>
        {label}
        <em className={styles.tabsHeaderDot} />
      </span>
    );
  }

  return (
    <span className={styles.tabsHeaderCount}>
      {label}
      {!!calcCount && calcCount > 0 && (
        <span className={slots["tabs-count-badge"]}>{calcCount}</span>
      )}
    </span>
  );
};

export default HeaderCount;
