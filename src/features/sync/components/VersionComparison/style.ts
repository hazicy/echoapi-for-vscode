import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VersionModalWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["VersionModalWrap"],
  { selector: "ui_a21ee601_VersionModalWrap" },
);

export const DiffUserEditWrap = withStyles<"span", {}>(
  "span",
  moduleStyles["DiffUserEditWrap"],
  { selector: "ui_a21ee601_DiffUserEditWrap" },
);
