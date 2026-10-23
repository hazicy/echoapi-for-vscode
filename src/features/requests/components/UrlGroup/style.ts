import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const UrrGroupWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);

export const MethodDropdownWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["methodDropdown"],
);

export const OptionsItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["optionsItem"],
);
