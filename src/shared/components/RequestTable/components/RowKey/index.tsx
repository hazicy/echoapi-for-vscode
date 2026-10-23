import styles from "../../style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { moduleClassNames } from "@/shared/ui/base/moduleClassNames";
import { FC, memo, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  AutoComplete,
  Checkbox,
  CheckboxProps,
  Flex,
  Select,
} from "@/shared/ui/base";

import classnames from "classnames";
import { concat, isEqual, map } from "lodash";

import IconFont from "@/shared/ui/IconFont";
import Tooltip from "@/shared/ui/Tooltip";
import { REQUEST_HEADER } from "@/features/requests/constants";
import { FIELD_TYPES, STATUS_CODE } from "@/shared/constants/common";

import Context from "../../context";
import { ItemProps } from "../../types";

import VarInput from "@/features/variables/components/VarInput";

type Props = ItemProps & {
  showAiDescription?: boolean;
  showCheckbox?: boolean;
  inputDisabled?: boolean;
  showFieldType?: boolean;
};

const RowKey: FC<Props> = memo((props) => {
  const {
    rowData,
    rowIndex,
    tabType,
    onChange,
    readOnly,
    bodyMode,
    inputDisabled,
    showAiDescription,
    showCheckbox = true,
    showFieldType = true,
  } = props || {};

  const { t } = useTranslation();

  const { envId } = useContext(Context);

  const finalFieldType = useMemo(() => {
    if (isEqual(tabType, "body") && isEqual(bodyMode, "form-data")) {
      return concat(["File"], FIELD_TYPES);
    }

    return FIELD_TYPES;
  }, [FIELD_TYPES, tabType]);

  const handleChange = (key: string, newVal: string | number) => {
    const newRowData = {
      ...rowData,
      [key]: newVal,
    };

    onChange?.(rowIndex, newRowData);
  };

  const handleChangeNotNull = () => {
    handleChange?.("not_null", rowData.not_null == 1 ? -1 : 1);
  };

  const handleVarInputChange = (val: string) => {
    handleChange?.("key", val);
  };

  const handleFieldTypeChange = (val: string) => {
    handleChange?.("field_type", val);
  };

  const handleChangeChecked: CheckboxProps["onChange"] = (event) => {
    handleChange(
      "is_checked",
      event.target.checked ? STATUS_CODE.ENABLE : STATUS_CODE.DISABLE,
    );
  };

  const suffixIcon = (
    <div onClick={handleChangeNotNull}>
      <IconFont type="icon-drop-down" style={{ pointerEvents: "none" }} />
      <div
        style={{ pointerEvents: "visible" }}
        className={classnames({
          [slots.required]: true,
          [slots.checked]: rowData?.not_null == 1,
        })}
      >
        <Tooltip title={t("supplement.required")} placement="top">
          <IconFont style={{ fontSize: 14 }} type="icon-fuhao" />
        </Tooltip>
      </div>
    </div>
  );

  const handleBlur = async (newKey: string) => {
    if (!showAiDescription) {
      return;
    }

    const newRowData = {
      ...rowData,
      key: newKey,
    };

    onChange?.(rowIndex, newRowData);
  };

  return (
    <div className={styles.container}>
      {showCheckbox && (
        <Flex className={slots["checkbox-wrap"]} align="center">
          <Checkbox
            checked={isEqual(rowData?.is_checked, STATUS_CODE.ENABLE)}
            onChange={handleChangeChecked}
            disabled={!!rowData?.static}
          />
        </Flex>
      )}
      {!isEqual(tabType, "header") ? (
        <div className={slots["row-description"]}>
          <VarInput
            enableNewRow
            envId={envId}
            value={rowData?.key || ""}
            readOnly={readOnly || inputDisabled}
            onChange={handleVarInputChange}
            onBlur={handleBlur}
          />
        </div>
      ) : (
        <AutoComplete
          filterOption
          value={rowData?.key || ""}
          onChange={handleVarInputChange}
          disabled={readOnly || inputDisabled}
          options={map(REQUEST_HEADER, (item) => ({
            label: item,
            value: item,
          }))}
        />
      )}
      {!isEqual(tabType, "event") &&
        !isEqual(tabType, "socketio") &&
        showFieldType && (
          <Select
            suffixIcon={suffixIcon}
            value={rowData?.field_type || ""}
            onChange={handleFieldTypeChange}
            disabled={readOnly}
          >
            {map(finalFieldType, (item) => (
              <Select.Option value={item} key={item}>
                <span
                  className={classnames(
                    styles.selectFieldTypeOptionItem,
                    moduleClassNames(
                      slots,
                      `item-${item?.toLocaleLowerCase()}`,
                    ),
                  )}
                >
                  {item}
                </span>
              </Select.Option>
            ))}
          </Select>
        )}
    </div>
  );
});

export default RowKey;
