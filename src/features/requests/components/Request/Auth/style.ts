import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import "./style.css";

export const RequestAuthContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const MoreTipContainer = withStyles<"span", {}>(
  "span",
  moduleStyles["moreTip"],
);

export const CodeContainer = withStyles<"div", {}>("div", moduleStyles["code"]);

export const CheckedStyles = () => null;

export const Oauth2Container = withStyles<"div", {}>(
  "div",
  moduleStyles["oauth2"],
);
