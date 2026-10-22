import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ResponseErrorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ResponseErrorContainer"],
  { selector: "ui_5b314324_ResponseErrorContainer" },
);
