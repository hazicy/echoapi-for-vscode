import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const BthsPanelDiv = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const KeyWarperContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["keyWarper"],
);
