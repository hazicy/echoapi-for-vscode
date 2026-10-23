import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const SortableCollapseWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["SortableCollapseWrapper"],
  { selector: "ui_a6cd3eaa_SortableCollapseWrapper" },
);
