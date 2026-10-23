import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestingContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
