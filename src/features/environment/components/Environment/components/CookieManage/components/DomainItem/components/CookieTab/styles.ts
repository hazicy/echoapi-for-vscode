import moduleStyles from "./styles.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TabContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const BtnListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["btnList"],
);

export const TabItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["tabItem"],
);
