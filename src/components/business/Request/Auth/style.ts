import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import "./style.css";

export const RequestAuthContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestAuthContainer"],
  { selector: "ui_a48315f8_RequestAuthContainer" },
);

export const MoreTipContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["MoreTipContainer"],
  { selector: "ui_a48315f8_MoreTipContainer" },
);

export const CodeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["CodeContainer"],
  { selector: "ui_a48315f8_CodeContainer" },
);

export const CheckedStyles = () => null;

export const Oauth2Container = withStyles<"div", {}>(
  "div",
  moduleStyles["Oauth2Container"],
  { selector: "ui_a48315f8_Oauth2Container" },
);
