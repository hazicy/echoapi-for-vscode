import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RadioWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
export const RadioGroupWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["radioGroup"],
);
