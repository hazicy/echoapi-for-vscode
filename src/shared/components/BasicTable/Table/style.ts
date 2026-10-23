import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TableWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["table"],
);
