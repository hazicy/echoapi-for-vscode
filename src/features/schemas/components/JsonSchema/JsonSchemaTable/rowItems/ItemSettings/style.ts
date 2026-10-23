import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import "./style.css";

export const SettingsWrapperContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["SettingsWrapperContainer"],
  { selector: "ui_c879b96a_SettingsWrapperContainer" },
);

export const SettingContent = withStyles<"div", {}>(
  "div",
  moduleStyles["SettingContent"],
  { selector: "ui_c879b96a_SettingContent" },
);

export const SchemasPopStyle = () => null;
