import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const SettingWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["SettingWrap"], { selector: "ui_65bac3d8_SettingWrap" });

export const RawEditorWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["RawEditorWrap"],
  { selector: "ui_65bac3d8_RawEditorWrap" },
);

export const MessageHeaderWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["MessageHeaderWrap"],
  { selector: "ui_65bac3d8_MessageHeaderWrap" },
);
