import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RawEditorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RawEditorContainer"],
  { selector: "ui_f9ef6bf5_RawEditorContainer" },
);
