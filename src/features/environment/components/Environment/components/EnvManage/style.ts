import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TitleContainer"],
  { selector: "ui_119c839c_TitleContainer" },
);

export const EnvManageContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvManageContainer"],
  { selector: "ui_119c839c_EnvManageContainer" },
);

export const EnvOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvOpContainer"],
  { selector: "ui_119c839c_EnvOpContainer" },
);

export const VariableVarsOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["VariableVarsOpContainer"],
  { selector: "ui_119c839c_VariableVarsOpContainer" },
);
