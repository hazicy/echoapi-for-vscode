import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ImportExportWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);
