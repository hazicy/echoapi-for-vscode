import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ItemWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["ItemWrapper"],
  { selector: "ui_9a1c8b9a_ItemWrapper" },
);
