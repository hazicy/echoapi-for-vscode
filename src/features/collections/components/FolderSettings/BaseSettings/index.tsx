import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Flex, Input, InputRef, TreeSelect } from "@/shared/ui/base";

import { useDebounceEffect } from "ahooks";
import produce from "immer";

import useFolders from "@/features/collections/hooks/useFolders";
import { useApis } from "@/app/store";
import { FolderDetailsData } from "@/features/requests/types/folder";
import { ChangeFuncType } from "@/shared/types/common";

import ServerSelect from "./ServerSelect";

import { Empty } from "@/shared/ui";

interface Props {
  value: FolderDetailsData;
  onChange: (value: FolderDetailsData) => void;
}

const BaseSettings: FC<Props> = ({ value, onChange }) => {
  const { apisFolders } = useFolders({ currentTargetId: value?.target_id });
  const apisActiveKey = useApis((state) => state.apisActiveKey);
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);

  const handleChange: ChangeFuncType<FolderDetailsData> = (key, newValue) => {
    const newApisData = produce(value, (draft) => {
      draft[key] = newValue;
    });

    onChange(newApisData);
  };

  useDebounceEffect(
    () => {
      if (
        apisActiveKey === value?.target_id &&
        value?.is_create === 1 &&
        !value?.description
      ) {
        inputRef.current!.focus({
          cursor: "end",
        });
      }
    },
    [apisActiveKey],
    { wait: 100 },
  );

  return (
    <div className={styles.container}>
      <div className={slots["folder-base-config-wrap"]}>
        <Flex
          justify="space-between"
          align="center"
          className={slots["folder-save-wrap"]}
        >
          <Input
            ref={inputRef}
            className={slots["folder-base-input"]}
            maxLength={255}
            placeholder={t("supplement.folder")}
            value={value?.name}
            onChange={(event) => handleChange("name", event.target.value)}
          />
        </Flex>
        <Flex align="center" className={slots["folder-config-wrap"]}>
          <Flex className={slots["folder-config-item-wrap"]} vertical>
            <span className={slots.label}>
              {t("folder.folder_setting.service")}
            </span>
            <ServerSelect
              value={value?.server_id}
              onChange={(value) => handleChange("server_id", value)}
            />
          </Flex>
          <Flex className={slots["folder-config-item-wrap"]} vertical>
            <span className={slots.label}>{t("supplement.folder")}</span>
            <TreeSelect
              showSearch
              treeDefaultExpandAll
              placeholder={t("supplement.select_folder_tip")}
              style={{ width: "100%" }}
              filterTreeNode={(input, treeNode) => {
                return treeNode.name.includes(input);
              }}
              fieldNames={{
                label: "name",
                value: "target_id",
                children: "children",
              }}
              value={value?.parent_id}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={apisFolders}
              onChange={(value) => handleChange("parent_id", value)}
              notFoundContent={<Empty description="No Data" />}
            />
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default BaseSettings;
