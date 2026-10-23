import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ReportWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
