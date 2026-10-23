import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const TestingMainWarp = withStyles<"div", {}>(
  "div",
  moduleStyles["TestingMainWarp"],
  { selector: "ui_b7a3e222_TestingMainWarp" },
);

export const TestingConfigWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["TestingConfigWrap"],
  { selector: "ui_b7a3e222_TestingConfigWrap" },
);

export const FunctionalWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["FunctionalWrap"],
  { selector: "ui_b7a3e222_FunctionalWrap" },
);

export const ResultListWarp = withStyles<"div", {}>(
  "div",
  moduleStyles["ResultListWarp"],
  { selector: "ui_b7a3e222_ResultListWarp" },
);
