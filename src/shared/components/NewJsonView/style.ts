import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const NewJsonViewContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const JsonViewWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["jsonView"],
);

export const OtherPreViewWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["otherPreView"],
);
