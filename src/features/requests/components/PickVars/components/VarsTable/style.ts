import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VarsTableWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["VarsTableWrap"],
  { selector: "ui_50a811f9_VarsTableWrap" },
);

export const PopoverContentWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["PopoverContentWrap"],
  { selector: "ui_50a811f9_PopoverContentWrap" },
);
