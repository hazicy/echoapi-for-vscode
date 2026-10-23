import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const FolderSettingsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["FolderSettingsContainer"],
  { selector: "ui_c5aaa083_FolderSettingsContainer" },
);
