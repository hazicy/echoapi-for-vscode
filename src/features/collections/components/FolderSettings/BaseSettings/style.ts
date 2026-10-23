import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const BaseSettingsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const SelectGroupContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["selectGroup"],
);
