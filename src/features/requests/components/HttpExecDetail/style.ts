import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const HttpExecDetailWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);
