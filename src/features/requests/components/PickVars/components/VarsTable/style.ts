import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VarsTableWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const PopoverContentWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["popoverContent"],
);
