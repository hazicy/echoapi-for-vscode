import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const LineTabsContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["LineTabsContainer"],
  { selector: "ui_314e58c9_LineTabsContainer" },
);

export const TabsHeaderCountContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["TabsHeaderCountContainer"],
  { selector: "ui_314e58c9_TabsHeaderCountContainer" },
);

export const TabsHeaderDotContainer = withStyles<"em", {}>(
  "em",
  moduleStyles["TabsHeaderDotContainer"],
  { selector: "ui_314e58c9_TabsHeaderDotContainer" },
);
