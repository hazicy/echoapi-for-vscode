import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const RestfulQueryContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RestfulQueryContainer"],
  { selector: "ui_80cd432f_RestfulQueryContainer" },
);
