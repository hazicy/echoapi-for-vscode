import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const PushRightWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
