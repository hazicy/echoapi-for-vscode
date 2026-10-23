import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ResponseWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const EmptyWrapper = withStyles<"div", {}>("div", moduleStyles["empty"]);
