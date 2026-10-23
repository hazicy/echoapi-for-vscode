import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TreeMenuContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TreeMenuContainer"],
  { selector: "ui_6dffdf9f_TreeMenuContainer" },
);

export const TreeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TreeContainer"],
  { selector: "ui_6dffdf9f_TreeContainer" },
);

export const DefaultButtonNodeWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["DefaultButtonNodeWrap"],
  { selector: "ui_6dffdf9f_DefaultButtonNodeWrap" },
);

export const CreateOtherIcon = withStyles<"div", {}>(
  "div",
  moduleStyles["CreateOtherIcon"],
  { selector: "ui_6dffdf9f_CreateOtherIcon" },
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ItemTitleContainer"],
  { selector: "ui_6dffdf9f_ItemTitleContainer" },
);
