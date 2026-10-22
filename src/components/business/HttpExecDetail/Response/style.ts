import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ResponseWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["ResponseWrapper"],
  { selector: "ui_7291bf63_ResponseWrapper" },
);

export const EmptyWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["EmptyWrapper"],
  { selector: "ui_7291bf63_EmptyWrapper" },
);
