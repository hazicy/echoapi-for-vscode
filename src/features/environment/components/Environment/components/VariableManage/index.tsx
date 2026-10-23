import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Flex, Input, message } from "@/shared/ui/base";

import { cloneDeep, isPlainObject, keyBy, keys, mapValues } from "lodash";

import Table from "@/shared/components/BasicTable";
import Button from "@/shared/ui/Button";
import IconFont from "@/shared/ui/IconFont";
import { IEnvDataItem } from "@/features/project/types/variable";

import ValueInput from "../ValueInput";

import { useProjectConfig } from "@/app/store";
import { saveProjectConfig } from "@/features/requests/events/env";

export const defaultDataItem: IEnvDataItem = {
  key: "",
  value: "",
  current_value: "",
  description: "",
  static: true,
};
const Index = () => {
  const { t } = useTranslation();
  const { projectId: project_id } = useParams();
  const globalVars = useProjectConfig((state) => state.globalVars);
  const updateGlobalVars = useProjectConfig((state) => state.updateGlobalVars);
  const [globalVarsList, setGlobalVarsList] = useState<any>([]);
  const readonly = false;

  useEffect(() => {
    if (isPlainObject(globalVars)) {
      const varsList = keys(globalVars).map((key) => ({
        ...globalVars[key],
        key,
      }));
      if (varsList.length) {
        setGlobalVarsList(varsList);
      }
    } else {
      setGlobalVarsList([]);
    }
  }, [globalVars]);

  const handleVarChange = (rowData: any, index: number, newVal: any) => {
    const newList = cloneDeep(globalVarsList);
    delete rowData.static;
    newList[index] = {
      ...rowData,
      ...newVal,
    };
    setGlobalVarsList(newList);

    // Add auto-save logic
    // onOk(newList);
  };

  // Delete table item
  const handleDeleteItem = (index: number) => {
    const newList = [...globalVarsList];
    if (newList.length > 0) {
      newList.splice(index, 1);
      setGlobalVarsList([...newList]);
    }

    // Add auto-save logic
    // onOk([...newList]);
  };

  const globalColumn: any[] = [
    {
      title: t("global_setting.variables_table.variables"),
      dataIndex: "key",
      width: 320,
      render: (text: any, rowData: any, rowIndex: number) => (
        <Input
          size="middle"
          value={text}
          maxLength={128}
          disabled={readonly}
          onChange={(e) => {
            handleVarChange(rowData, rowIndex, { key: e.target.value });
          }}
        />
      ),
    },
    {
      title: t("global_setting.variables_table.initial_value"),
      dataIndex: "value",
      width: 320,
      render: (text: any, rowData: any, rowIndex: number) => (
        <ValueInput
          value={String(text)}
          disabled={readonly}
          onChange={(e) => handleVarChange(rowData, rowIndex, { value: e })}
        />
      ),
    },
    {
      title: t("global_setting.variables_table.current_value"),
      dataIndex: "current_value",
      width: 320,
      render: (text: any, rowData: any, rowIndex: number) => (
        <ValueInput
          value={String(text)}
          disabled={readonly}
          onChange={(e) =>
            handleVarChange(rowData, rowIndex, { current_value: e })
          }
        />
      ),
    },
    {
      title: t("global_setting.variables_table.description"),
      dataIndex: "description",
      width: 320,
      render: (text: any, rowData: any, rowIndex: number) => (
        <ValueInput
          onChange={(e) =>
            handleVarChange(rowData, rowIndex, { description: e })
          }
          value={String(text)}
          disabled={readonly}
        />
      ),
    },
    {
      title: "",
      dataIndex: "del",
      width: 44,
      render: (_text: any, _rowData: any, rowIndex: number) =>
        readonly ? (
          <></>
        ) : (
          <div className={styles.variableOp}>
            <IconFont
              onClick={() => handleDeleteItem(rowIndex)}
              type="icon-delete"
            />
          </div>
        ),
    },
  ];

  const getGlobalVarsList = () => {
    const hasStatic = globalVarsList.some((item: any) => item.static);
    if (!hasStatic) {
      return [...globalVarsList, { ...defaultDataItem }];
    }
    return [...globalVarsList];
  };

  const onOk = () => {
    try {
      const leachGlobalVarsList = globalVarsList.filter((e: any) =>
        e.key?.trim(),
      );
      const global_var_list = mapValues(
        keyBy(leachGlobalVarsList, "key"),
        ({ value, current_value, description }) => ({
          value: value?.trim(),
          current_value: current_value?.trim(),
          description: description?.trim(),
        }),
      );

      saveProjectConfig("globalVars", global_var_list);

      // await saveVarListRequest({ project_id, global_var_list });
      updateGlobalVars(global_var_list);
      message.success("Success");
    } catch (err) {
      /* empty */
    }
  };

  return (
    <div className={styles.container}>
      <Flex className={slots["variable-flex"]} vertical gap={15}>
        <Flex vertical gap={15} className="variable-title">
          <span className={slots.title}>
            {" "}
            {t("global_setting.variables_detail.title")}
          </span>
          <span className={slots.tip}>
            {t("global_setting.variables_detail.tips")}
          </span>
        </Flex>
        <div className={slots["variable-content"]}>
          <Table
            rowKey={(_, i) => `${i}`}
            dataSource={getGlobalVarsList()}
            columns={globalColumn}
          />
        </div>
        <Flex justify="flex-end">
          <Button onClick={onOk} type="primary">
            {t("global_setting.variables_detail.save")}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default Index;
