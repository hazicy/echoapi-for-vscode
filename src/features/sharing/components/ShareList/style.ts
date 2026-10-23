import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ShareContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const DocListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["docList"],
);

export const ItemTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["itemTitle"],
);

export const TabsWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["tabs"]);

export const ControlExtraContentStyles = withStyles<
  "div",
  {
    $token: Partial<GlobalThemeToken>;
  }
>("div", moduleStyles["controlExtraContent"]);

export const ShareListWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["shareList"],
);
