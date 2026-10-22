import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ResponseContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ResponseContainer"],
  { selector: "ui_10398320_ResponseContainer" },
);
