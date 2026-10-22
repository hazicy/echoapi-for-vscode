import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const HeaderContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["HeaderContainer"],
  { selector: "ui_70051709_HeaderContainer" },
);
