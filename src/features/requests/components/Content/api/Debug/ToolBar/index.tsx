import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { saveProjectConfig } from "@/features/requests/events/env";
import { FC } from "react";
import { Flex, MenuProps } from "@/shared/ui/base";
import { useMemoizedFn } from "ahooks";
import produce from "immer";
import TitleEdit from "@/shared/ui/TitleEdit";
import EnvDropdown from "@/features/environment/components/EnvDropdown";
import { useProjectConfig } from "@/app/store";
import { ApiDetailsData } from "@/features/requests/types/api";
import { ChangeFuncType } from "@/shared/types/common";

import LayoutControl from "@/shared/components/ResizablePanels/LayoutControl";

interface Props {
  showLayoutControl?: boolean;
  apisData: ApiDetailsData;
  onApisDataChange: (data: ApiDetailsData) => void;
}
const ToolBar: FC<Props> = ({
  apisData,
  onApisDataChange,
  showLayoutControl,
}) => {
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const updateEnvDetailKeys = useProjectConfig(
    (state) => state.updateEnvDetailKeys,
  );
  const handleChange: ChangeFuncType<ApiDetailsData> = useMemoizedFn(
    (field, value) => {
      const newData = produce(apisData, (draft) => {
        draft[field] = value;
      });

      onApisDataChange(newData);
    },
  );

  const envClick: MenuProps["onClick"] = ({ key }) => {
    // Switch environment
    updateEnvDetailKeys(key);
    saveProjectConfig("envDetailKeys", key);
  };

  return (
    <div className={styles.container}>
      <Flex
        gap={4}
        className={slots["tab-bar-extra-content-wrap"]}
        align="center"
        justify="space-between"
      >
        <Flex gap={8} align="center" className={slots["edit-wrap"]} flex={1}>
          <TitleEdit
            maxLength={255}
            className={slots["apis-title-edit"]}
            value={apisData?.name}
            onChange={(event) => handleChange("name", event.target.value)}
          />
        </Flex>
        <Flex style={{ height: 26 }} gap={8} align="center">
          {showLayoutControl && <LayoutControl />}
          <EnvDropdown isApis value={envDetailKeys} onEnvClick={envClick} />
        </Flex>
      </Flex>
    </div>
  );
};

export default ToolBar;
