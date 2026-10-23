import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

const lineLoading = "animation_56ec475e_lineLoading";

export const ResponseSendContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);
