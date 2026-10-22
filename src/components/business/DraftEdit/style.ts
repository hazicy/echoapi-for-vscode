import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ContainerWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ContainerWrap"], {
  selector: "ui_e04a8b24_ContainerWrap",
});
export const DraftWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["DraftWrap"],
  { selector: "ui_e04a8b24_DraftWrap" },
);
