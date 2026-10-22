import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const LoadingWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["LoadingWrapper"],
  { selector: "ui_e1b00ec5_LoadingWrapper" },
);
