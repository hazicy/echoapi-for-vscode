import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const CollapseWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["CollapseWrapper"], {
  selector: "ui_0d5d536e_CollapseWrapper",
});
