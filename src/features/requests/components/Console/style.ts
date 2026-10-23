import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ConsoleWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const ConsoleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["console"],
);
