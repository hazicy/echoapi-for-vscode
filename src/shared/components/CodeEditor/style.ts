import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const EditorWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["EditorWrap"],
  { selector: "ui_a6970446_EditorWrap" },
);
