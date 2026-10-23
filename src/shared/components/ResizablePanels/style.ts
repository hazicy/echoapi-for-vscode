import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ResizablePanelsContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);
