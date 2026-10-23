import styles from "../../style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, memo } from "react";

import { Flex, Switch } from "@/shared/ui/base";

import { isEqual } from "lodash";

import { ItemProps } from "../../types";

type Props = ItemProps;

export const RowDescription: FC<Props> = memo((props) => {
  const { rowData, rowIndex, onChange, readOnly } = props;

  const handleChange = (key: string, newVal: string | number) => {
    const newRowData = {
      ...rowData,
      [key]: newVal,
    };
    onChange?.(rowIndex, newRowData);
  };

  return (
    <div className={styles.container}>
      <Flex align="center" className={slots["row-listen"]}>
        <Switch
          checked={isEqual(rowData?.value, "1")}
          onChange={(checked) => handleChange?.("value", checked ? "1" : "-1")}
          disabled={readOnly}
        />
      </Flex>
    </div>
  );
});

export default RowDescription;
