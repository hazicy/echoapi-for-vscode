import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const PushWrap = withStyles<"div", {}>("div", moduleStyles["PushWrap"], {
  selector: "ui_211fb877_PushWrap",
});

export const PushWrapContent = withStyles<"div", {}>(
  "div",
  moduleStyles["PushWrapContent"],
  { selector: "ui_211fb877_PushWrapContent" },
);
