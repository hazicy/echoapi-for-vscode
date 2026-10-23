import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestingResultWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["TestingResultWrapper"],
  { selector: "ui_dd4e379b_TestingResultWrapper" },
);
