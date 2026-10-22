import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const AllListWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["AllListWrapper"],
  { selector: "ui_cb5f7a6e_AllListWrapper" },
);

export const CustomPopoverWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["CustomPopoverWrap"],
  { selector: "ui_cb5f7a6e_CustomPopoverWrap" },
);
