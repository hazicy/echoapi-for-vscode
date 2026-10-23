import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestsWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["TestsWrapper"],
  { selector: "ui_98f1e23f_TestsWrapper" },
);
