import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ResponseContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ResponseContainer"],
  { selector: "ui_d782346c_ResponseContainer" },
);
