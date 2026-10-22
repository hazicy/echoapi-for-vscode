import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const ServerNameContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ServerNameContainer"],
  { selector: "ui_b634fb6a_ServerNameContainer" },
);

export const EnvAddContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvAddContainer"],
  { selector: "ui_b634fb6a_EnvAddContainer" },
);

export const EnvServerTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvServerTitleContainer"],
  { selector: "ui_b634fb6a_EnvServerTitleContainer" },
);

export const EnvServerContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvServerContainer"],
  { selector: "ui_b634fb6a_EnvServerContainer" },
);
