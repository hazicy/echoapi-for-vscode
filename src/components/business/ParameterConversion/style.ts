import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ParameterContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ParameterContainer"],
  { selector: "ui_50cd73b9_ParameterContainer" },
);

export const TipContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["TipContainer"],
  { selector: "ui_50cd73b9_TipContainer" },
);
