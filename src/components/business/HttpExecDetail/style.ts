import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const HttpExecDetailWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["HttpExecDetailWrapper"], {
  selector: "ui_ac1c9a30_HttpExecDetailWrapper",
});
