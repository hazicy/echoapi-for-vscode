import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ShareContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ShareContainer"],
  { selector: "ui_ab585b0c_ShareContainer" },
);

export const DocListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["DocListContainer"],
  { selector: "ui_ab585b0c_DocListContainer" },
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ItemTitleContainer"],
  { selector: "ui_ab585b0c_ItemTitleContainer" },
);

export const TabsWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["TabsWrap"], { selector: "ui_ab585b0c_TabsWrap" });

export const ControlExtraContentStyles = withStyles<
  "div",
  {
    $token: Partial<GlobalThemeToken>;
  }
>("div", moduleStyles["ControlExtraContentStyles"], {
  selector: "ui_ab585b0c_ControlExtraContentStyles",
});

export const ShareListWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["ShareListWrap"],
  { selector: "ui_ab585b0c_ShareListWrap" },
);
