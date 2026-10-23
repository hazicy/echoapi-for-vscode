import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const DraggableMenuContainer = withStyles<"ul", {}>(
  "ul",
  moduleStyles["container"],
);

export const DraggableMenuGroupContainer = withStyles<"li", {}>(
  "li",
  moduleStyles["draggableMenuGroup"],
);

export const DraggableMenuItemContainer = withStyles<"li", {}>(
  "li",
  moduleStyles["draggableMenuItem"],
);
