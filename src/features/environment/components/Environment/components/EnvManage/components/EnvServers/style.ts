import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const ServerNameContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const EnvAddContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envAdd"],
);

export const EnvServerTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envServerTitle"],
);

export const EnvServerContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envServer"],
);
