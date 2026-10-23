import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const EnvironmentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvironmentContainer"],
  { selector: "ui_ee9ecae5_EnvironmentContainer" },
);

export const Render = withStyles<"div", {}>("div", moduleStyles["Render"], {
  selector: "ui_ee9ecae5_Render",
});

export const EnvLabel = withStyles<"div", {}>("div", moduleStyles["EnvLabel"], {
  selector: "ui_ee9ecae5_EnvLabel",
});

export const LeftMenuContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["LeftMenuContainer"],
  { selector: "ui_ee9ecae5_LeftMenuContainer" },
);

export const MenuTitle = withStyles<"span", {}>(
  "span",
  moduleStyles["MenuTitle"],
  { selector: "ui_ee9ecae5_MenuTitle" },
);

export const MenuChildTitle = withStyles<"span", {}>(
  "span",
  moduleStyles["MenuChildTitle"],
  { selector: "ui_ee9ecae5_MenuChildTitle" },
);

export const MenuIconContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["MenuIconContainer"],
  { selector: "ui_ee9ecae5_MenuIconContainer" },
);

export const EnvIconContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvIconContainer"],
  { selector: "ui_ee9ecae5_EnvIconContainer" },
);
