import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RequestBodyContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const RequestBodyContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["requestBodyContent"],
);
