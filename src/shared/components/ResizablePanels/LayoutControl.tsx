import { useTranslation } from "react-i18next";
import { useSystemConfig } from "@/app/store";
import { STATUS_CODE } from "@/shared/constants/common";
import { Button, Flex } from "@/shared/ui/base";
import IconFont from "@/shared/ui/IconFont";

export default function LayoutControl() {
  const { t } = useTranslation();
  const direction = useSystemConfig((state) => state.systemConfig?.tab_direction);

  const changeDirection = (vertical: boolean) => {
    const tab_direction = vertical ? STATUS_CODE.ENABLE : STATUS_CODE.DISABLE;
    const { systemConfig, updateSystemConfig } = useSystemConfig.getState();
    updateSystemConfig({ ...systemConfig, tab_direction });
    window?.vscode.postMessage({
      action: "setSystemConfig",
      data: { tab_direction },
    });
  };

  return (
    <Flex gap={4} align="center">
      {[true, false].map((vertical) => {
        const label = t(`common.response_component.${vertical ? "single_pane" : "two_pane"}`);
        return (
          <Button
            key={String(vertical)}
            type="text"
            size="small"
            title={label}
            aria-label={label}
            aria-pressed={vertical ? direction === STATUS_CODE.ENABLE : direction === STATUS_CODE.DISABLE}
            onClick={() => changeDirection(vertical)}
          >
            <IconFont type={vertical ? "icon-up-down" : "icon-left-right"} />
          </Button>
        );
      })}
    </Flex>
  );
}
