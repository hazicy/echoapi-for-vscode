import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ContentContainer"],
  { selector: "ui_1ea4f4bd_ContentContainer" },
);

export const ListItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ListItemContainer"],
  { selector: "ui_1ea4f4bd_ListItemContainer" },
);
