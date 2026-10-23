import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VariableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["VariableContainer"],
  { selector: "ui_b0bacb24_VariableContainer" },
);

export const VariableOpContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["VariableOpContainer"],
  { selector: "ui_b0bacb24_VariableOpContainer" },
);
