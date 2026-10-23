import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestingResultWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
