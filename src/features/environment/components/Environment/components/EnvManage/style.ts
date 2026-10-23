import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const EnvManageContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envManage"],
);

export const EnvOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envOp"],
);

export const VariableVarsOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["variableVarsOp"],
);
