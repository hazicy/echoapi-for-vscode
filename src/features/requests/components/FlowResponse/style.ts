import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const FlowResponseWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["FlowResponseWrap"], {
  selector: "ui_41af12e7_FlowResponseWrap",
});
