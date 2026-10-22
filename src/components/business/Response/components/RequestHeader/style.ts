import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const RequestHeaderContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestHeaderContainer"],
  { selector: "ui_4f9ab176_RequestHeaderContainer" },
);
