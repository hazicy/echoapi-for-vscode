import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const RealRequestContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RealRequestContainer"],
  { selector: "ui_b4878943_RealRequestContainer" },
);

export const RequestItem = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["RequestItem"],
  {
    selector: "ui_b4878943_RequestItem",
    attrs: {
      vertical: true,
      gap: 8,
    },
  },
);

export const TabBarExtraContentWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["TabBarExtraContentWrap"],
  {
    selector: "ui_b4878943_TabBarExtraContentWrap",
    attrs: {
      align: "center",
    },
  },
);
