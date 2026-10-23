import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const UrrGroupWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["UrrGroupWrap"], {
  selector: "ui_fc21231a_UrrGroupWrap",
});

export const MethodDropdownWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["MethodDropdownWrap"],
  { selector: "ui_fc21231a_MethodDropdownWrap" },
);

export const OptionsItemContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["OptionsItemContainer"],
  { selector: "ui_fc21231a_OptionsItemContainer" },
);
