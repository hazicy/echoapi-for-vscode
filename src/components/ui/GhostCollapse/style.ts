import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const GhostCollapseWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["GhostCollapseWrapper"], {
  selector: "ui_5a2bcc7d_GhostCollapseWrapper",
});
