import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const DotWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["DotWrapper"], { selector: "ui_36d11b71_DotWrapper" });
