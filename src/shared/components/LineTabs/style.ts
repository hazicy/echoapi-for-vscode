import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const LineTabsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TabsHeaderCountContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["tabsHeaderCount"],
);

export const TabsHeaderDotContainer = withStyles<"em", {}>(
  "em",
  moduleStyles["tabsHeaderDot"],
);
