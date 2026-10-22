import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const DragContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["DragContainer"],
  { selector: "ui_dbb139c3_DragContainer" },
);
