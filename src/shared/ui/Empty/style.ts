import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const EmptyWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export default EmptyWrap;
