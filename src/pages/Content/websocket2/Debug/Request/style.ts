import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const SettingWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["SettingWrap"], { selector: "ui_41311e70_SettingWrap" });

export const MessageHeaderWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["MessageHeaderWrap"],
  { selector: "ui_41311e70_MessageHeaderWrap" },
);
