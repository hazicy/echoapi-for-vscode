import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const BaseSettingsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["BaseSettingsContainer"],
  { selector: "ui_8c5b34b1_BaseSettingsContainer" },
);

export const SelectGroupContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["SelectGroupContainer"],
  { selector: "ui_8c5b34b1_SelectGroupContainer" },
);
