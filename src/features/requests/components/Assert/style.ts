import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const AssertWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);

export const DescWrapper = withStyles<"span", {}>("span", moduleStyles["desc"]);
