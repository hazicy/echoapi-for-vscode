import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const RawEditorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RawEditorContainer"],
  { selector: "ui_0b82a8ee_RawEditorContainer" },
);

export const ParamsFieldEditorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ParamsFieldEditorContainer"],
  { selector: "ui_0b82a8ee_ParamsFieldEditorContainer" },
);
