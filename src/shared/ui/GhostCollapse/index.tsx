import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import { useMemo } from "react";

import type { CollapseProps as AntdCollapseProps } from "@/shared/ui/base";
import { Collapse as AntdCollapse, ConfigProvider } from "@/shared/ui/base";

import classNames from "classnames";

import IconFont from "@/shared/ui/IconFont";
import useTheme from "@/shared/hooks/useTheme";

import { getTheme } from "./theme";

type GhostCollapseProps = AntdCollapseProps & {
  /**whether header spacing follows content width */
  fitContent?: boolean;
};

const GhostCollapse = ({
  fitContent = true,
  ...restProps
}: GhostCollapseProps) => {
  const { themeToken } = useTheme();
  const theme = useMemo(() => getTheme(), []);

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.container}>
        <AntdCollapse
          rootClassName={classNames({ [slots["fit-content"]]: fitContent })}
          expandIcon={({ isActive }) => (
            <IconFont
              type="icon-arrow-down"
              style={{ color: themeToken.iconColor }}
              rotate={isActive ? 0 : -90}
            />
          )}
          expandIconPosition="end"
          ghost
          {...restProps}
        />
      </div>
    </ConfigProvider>
  );
};

export default GhostCollapse;
