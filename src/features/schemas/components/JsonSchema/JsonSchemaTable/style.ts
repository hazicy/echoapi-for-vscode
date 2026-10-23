import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const SchemaWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);
