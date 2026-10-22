import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const TestingContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TestingContainer"],
  { selector: "ui_7c50785d_TestingContainer" },
);
