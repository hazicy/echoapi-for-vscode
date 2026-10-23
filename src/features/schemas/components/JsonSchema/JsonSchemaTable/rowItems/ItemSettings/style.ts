import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import "./style.css";

export const SettingsWrapperContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const SettingContent = withStyles<"div", {}>(
  "div",
  moduleStyles["settingContent"],
);

export const SchemasPopStyle = () => null;
