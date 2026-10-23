import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const AllCheckContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
