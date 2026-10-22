import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

import IconFont from "@/components/ui/IconFont";

export const GenerateCodeWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["GenerateCodeWrap"],
  { selector: "ui_a6d546c5_GenerateCodeWrap" },
);

export const LanguagesIcon = withStyles<typeof IconFont, {}>(
  IconFont,
  moduleStyles["LanguagesIcon"],
  { selector: "ui_a6d546c5_LanguagesIcon" },
);
