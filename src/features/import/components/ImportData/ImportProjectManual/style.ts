import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ImportProjectManualWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ImportProjectManualWrap"], {
  selector: "ui_1d490bd8_ImportProjectManualWrap",
});

export const ImportExportWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ImportExportWrap"], {
  selector: "ui_1d490bd8_ImportExportWrap",
});
