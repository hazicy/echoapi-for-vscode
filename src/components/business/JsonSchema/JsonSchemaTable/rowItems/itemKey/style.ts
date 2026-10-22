import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const BthsPanelDiv = withStyles<"div", {}>(
  "div",
  moduleStyles["BthsPanelDiv"],
  { selector: "ui_78717613_BthsPanelDiv" },
);

export const KeyWarperContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["KeyWarperContainer"],
  { selector: "ui_78717613_KeyWarperContainer" },
);
