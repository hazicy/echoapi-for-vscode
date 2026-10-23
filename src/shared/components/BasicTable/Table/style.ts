import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TableWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["TableWrapper"],
  { selector: "ui_ac956de4_TableWrapper" },
);

export const TableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TableContainer"],
  { selector: "ui_ac956de4_TableContainer" },
);
