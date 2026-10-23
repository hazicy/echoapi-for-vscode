import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import IconFont from "@/shared/ui/IconFont";

export const GenerateCodeWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const LanguagesIcon = withStyles<typeof IconFont, {}>(
  IconFont,
  moduleStyles["languagesIcon"],
);
