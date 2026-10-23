import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VariableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const VariableOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["variableOp"],
);
