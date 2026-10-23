import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const HistoryReportListWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["HistoryReportListWrapper"],
  { selector: "ui_d76e77a6_HistoryReportListWrapper" },
);

export const HistoryReportListItem = withStyles<"div", {}>(
  "div",
  moduleStyles["HistoryReportListItem"],
  { selector: "ui_d76e77a6_HistoryReportListItem" },
);
