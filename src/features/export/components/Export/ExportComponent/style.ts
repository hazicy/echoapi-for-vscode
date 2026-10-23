import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ImportExportWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ImportExportWrap"], {
  selector: "ui_4328ac9a_ImportExportWrap",
});
