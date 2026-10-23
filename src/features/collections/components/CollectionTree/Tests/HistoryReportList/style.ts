import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const HistoryReportListWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const HistoryReportListItem = withStyles<"div", {}>(
  "div",
  moduleStyles["historyReportListItem"],
);
