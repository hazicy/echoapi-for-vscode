import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ContentWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["ContentWrap"],
  { selector: "ui_9639ada5_ContentWrap" },
);

export const VersionEditWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["VersionEditWrap"],
  { selector: "ui_9639ada5_VersionEditWrap" },
);
