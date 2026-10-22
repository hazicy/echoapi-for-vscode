import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const AssertWrapper = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["AssertWrapper"], {
  selector: "ui_47182b93_AssertWrapper",
});

export const DescWrapper = withStyles<"span", {}>(
  "span",
  moduleStyles["DescWrapper"],
  { selector: "ui_47182b93_DescWrapper" },
);
