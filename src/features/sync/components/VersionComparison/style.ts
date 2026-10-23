import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const VersionModalWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const DiffUserEditWrap = withStyles<"span", {}>(
  "span",
  moduleStyles["diffUserEdit"],
);
