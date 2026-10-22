import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const NewJsonViewContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["NewJsonViewContainer"],
  { selector: "ui_658c9b94_NewJsonViewContainer" },
);

export const JsonViewWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["JsonViewWrap"],
  { selector: "ui_658c9b94_JsonViewWrap" },
);

export const OtherPreViewWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["OtherPreViewWrap"],
  { selector: "ui_658c9b94_OtherPreViewWrap" },
);
