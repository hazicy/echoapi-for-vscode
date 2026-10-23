import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ContentWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const VersionEditWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["versionEdit"],
);
