import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const SearchContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["SearchContainer"],
  { selector: "ui_9a7535a0_SearchContainer" },
);
