import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ConsoleWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["ConsoleWrapper"],
  { selector: "ui_9f9653f1_ConsoleWrapper" },
);

export const ConsoleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ConsoleContainer"],
  { selector: "ui_9f9653f1_ConsoleContainer" },
);
