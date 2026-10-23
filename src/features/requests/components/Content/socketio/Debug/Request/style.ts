import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const SettingWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);

export const RawEditorWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["rawEditor"],
);

export const MessageHeaderWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["messageHeader"],
);
