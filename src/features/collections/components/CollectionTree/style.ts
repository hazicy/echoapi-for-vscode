import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TreeMenuContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TreeContainer = withStyles<"div", {}>("div", moduleStyles["tree"]);

export const DefaultButtonNodeWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["defaultButtonNode"],
);

export const CreateOtherIcon = withStyles<"div", {}>(
  "div",
  moduleStyles["createOtherIcon"],
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["itemTitle"],
);
