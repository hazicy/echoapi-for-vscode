import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const EnvironmentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const Render = withStyles<"div", {}>("div", moduleStyles["render"]);

export const EnvLabel = withStyles<"div", {}>("div", moduleStyles["envLabel"]);

export const LeftMenuContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["leftMenu"],
);

export const MenuTitle = withStyles<"span", {}>(
  "span",
  moduleStyles["menuTitle"],
);

export const MenuChildTitle = withStyles<"span", {}>(
  "span",
  moduleStyles["menuChildTitle"],
);

export const MenuIconContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["menuIcon"],
);

export const EnvIconContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envIcon"],
);
