import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ParameterContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TipContainer = withStyles<"span", {}>("span", moduleStyles["tip"]);
