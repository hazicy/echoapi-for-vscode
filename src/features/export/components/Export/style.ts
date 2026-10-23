import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ExportWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["ExportWrap"],
  { selector: "ui_b9998105_ExportWrap" },
);
