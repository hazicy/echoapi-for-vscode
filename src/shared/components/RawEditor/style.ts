import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RawEditorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const ParamsFieldEditorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["paramsFieldEditor"],
);
