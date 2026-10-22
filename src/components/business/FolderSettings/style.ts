import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const FolderSettingsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["FolderSettingsContainer"],
  { selector: "ui_c5aaa083_FolderSettingsContainer" },
);
