import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const PushWrap = withStyles<"div", {}>("div", moduleStyles["container"]);

export const PushWrapContent = withStyles<"div", {}>(
  "div",
  moduleStyles["pushWrapContent"],
);
