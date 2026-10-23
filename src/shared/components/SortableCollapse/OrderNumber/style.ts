import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const OrderNumberWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["OrderNumberWrapper"], {
  selector: "ui_334ee845_OrderNumberWrapper",
});
