import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const CustomScriptWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["CustomScriptWrapper"], {
  selector: "ui_7113d2a0_CustomScriptWrapper",
});
