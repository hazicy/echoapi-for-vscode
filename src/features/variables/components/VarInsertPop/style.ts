import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const ListItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["listItem"],
);
