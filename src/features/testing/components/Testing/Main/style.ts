import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestingMainWarp = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TestingConfigWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["testingConfig"],
);

export const FunctionalWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["functional"],
);

export const ResultListWarp = withStyles<"div", {}>(
  "div",
  moduleStyles["resultList"],
);
