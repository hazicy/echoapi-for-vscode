import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

const DefaultStyle = withStyles<"div", {}>(
  "div",
  moduleStyles["DefaultStyle"],
  { selector: "ui_13943ea7_DefaultStyle" },
);

export default DefaultStyle;
