import styles from "./style.module.css";
import { FC } from "react";

import cn from "classnames";

import IconFont from "@/shared/ui/IconFont";

const defaultGradientColor = ["#F6504B", "#F98E8B"];

interface Props {
  gradientColor: string[];
  icon: string;
  className?: string;
}

const ApisColorPrefixIcon: FC<Props> = ({ gradientColor, icon, className }) => {
  return (
    <div
      style={{
        background: `linear-gradient(${(gradientColor || defaultGradientColor).join(",")})`,
      }}
      className={cn(styles.container, cn(className))}
    >
      <IconFont type={icon} />
    </div>
  );
};

export default ApisColorPrefixIcon;
