import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const PickVarWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["PickVarWrapper"], {
  selector: "ui_a29906e0_PickVarWrapper",
});

export const DescWrapper = withStyles<"span", {}>(
  "span",
  moduleStyles["DescWrapper"],
  { selector: "ui_a29906e0_DescWrapper" },
);
