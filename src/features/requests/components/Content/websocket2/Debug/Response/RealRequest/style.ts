import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const RealRequestContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RealRequestContainer"],
  { selector: "ui_95f728e2_RealRequestContainer" },
);

export const RequestItem = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["RequestItem"],
  {
    selector: "ui_95f728e2_RequestItem",
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
    selector: "ui_95f728e2_TabBarExtraContentWrap",
    attrs: {
      align: "center",
    },
  },
);
