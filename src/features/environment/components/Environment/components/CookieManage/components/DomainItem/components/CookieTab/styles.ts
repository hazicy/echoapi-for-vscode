import moduleStyles from "./styles.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TabContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TabContainer"],
  { selector: "ui_76fd6009_TabContainer" },
);

export const BtnListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["BtnListContainer"],
  { selector: "ui_76fd6009_BtnListContainer" },
);

export const TabItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TabItemContainer"],
  { selector: "ui_76fd6009_TabItemContainer" },
);
