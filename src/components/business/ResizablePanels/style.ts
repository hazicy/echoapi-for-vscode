import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ResizablePanelsContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ResizablePanelsContainer"], {
  selector: "ui_bd590f1d_ResizablePanelsContainer",
});
