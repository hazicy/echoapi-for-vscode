import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const RequestBodyContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestBodyContainer"],
  { selector: "ui_0abf6f3a_RequestBodyContainer" },
);

export const RequestBodyContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestBodyContentContainer"],
  { selector: "ui_0abf6f3a_RequestBodyContentContainer" },
);
