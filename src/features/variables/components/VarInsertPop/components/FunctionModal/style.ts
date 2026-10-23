import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const FuncModalContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
