import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TreeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["itemTitle"],
);
