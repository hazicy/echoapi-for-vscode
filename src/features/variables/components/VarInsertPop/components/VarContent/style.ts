import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ContentContainer"],
  { selector: "ui_5a13ccd8_ContentContainer" },
);

export const TreeDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TreeDropDownContainer"],
  { selector: "ui_5a13ccd8_TreeDropDownContainer" },
);

export const TreeTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["TreeTitleContainer"],
  { selector: "ui_5a13ccd8_TreeTitleContainer" },
);

export const TreeValueContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["TreeValueContainer"],
  { selector: "ui_5a13ccd8_TreeValueContainer" },
);
