import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TreeCheckboxContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
