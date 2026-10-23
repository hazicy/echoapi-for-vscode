import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

const DefaultStyle = withStyles<"div", {}>(
  "div",
  moduleStyles["DefaultStyle"],
  { selector: "ui_1c3730ae_DefaultStyle" },
);

export default DefaultStyle;
