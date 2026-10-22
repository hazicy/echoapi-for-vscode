import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

const DefaultStyle = withStyles<"div", {}>(
  "div",
  moduleStyles["DefaultStyle"],
  { selector: "ui_b5e82c6a_DefaultStyle" },
);

export default DefaultStyle;
