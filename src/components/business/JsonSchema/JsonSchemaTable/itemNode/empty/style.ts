import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const EmptyWarper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["EmptyWarper"], { selector: "ui_977da8ba_EmptyWarper" });
