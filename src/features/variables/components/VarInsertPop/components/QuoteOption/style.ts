import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const QuoteOptionContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["QuoteOptionContainer"],
  { selector: "ui_eaff509f_QuoteOptionContainer" },
);
