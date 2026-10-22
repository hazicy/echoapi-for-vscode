import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const EmptyWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["EmptyWrap"],
  { selector: "ui_5dfcc5ec_EmptyWrap" },
);

export default EmptyWrap;
