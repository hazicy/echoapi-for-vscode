import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TeamMenuWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["TeamMenuWrapper"],
  { selector: "ui_7bfa41be_TeamMenuWrapper" },
);

export const MenuItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["MenuItemContainer"],
  { selector: "ui_7bfa41be_MenuItemContainer" },
);

export const MigrateItemWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["MigrateItemWrapper"],
  { selector: "ui_7bfa41be_MigrateItemWrapper" },
);
