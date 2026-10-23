import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const RealRequestContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const RequestItem = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["requestItem"],
  {
    attrs: {
      vertical: true,
      gap: 8,
    },
  },
);

export const TabBarExtraContentWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["tabBarExtraContent"],
  {
    attrs: {
      align: "center",
    },
  },
);
