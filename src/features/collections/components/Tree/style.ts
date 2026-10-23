import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TreeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TreeContainer"],
  { selector: "ui_11bff46c_TreeContainer" },
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ItemTitleContainer"],
  { selector: "ui_11bff46c_ItemTitleContainer" },
);
