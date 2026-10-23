import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TeamWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["TeamWrapper"],
  { selector: "ui_856b46d2_TeamWrapper" },
);

export const ProjectContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ProjectContainer"],
  { selector: "ui_856b46d2_ProjectContainer" },
);
