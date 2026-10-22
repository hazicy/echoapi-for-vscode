import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const DraggableMenuContainer = withStyles<"ul", {}>(
  "ul",
  moduleStyles["DraggableMenuContainer"],
  { selector: "ui_15c3d625_DraggableMenuContainer" },
);

export const DraggableMenuGroupContainer = withStyles<"li", {}>(
  "li",
  moduleStyles["DraggableMenuGroupContainer"],
  { selector: "ui_15c3d625_DraggableMenuGroupContainer" },
);

export const DraggableMenuItemContainer = withStyles<"li", {}>(
  "li",
  moduleStyles["DraggableMenuItemContainer"],
  { selector: "ui_15c3d625_DraggableMenuItemContainer" },
);
