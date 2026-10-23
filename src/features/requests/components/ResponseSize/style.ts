import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const CustomPopoverWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const CustomProxyWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["customProxy"],
);

export const CustomCodePopoverWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["customCodePopover"],
);

export const CustomSizePopoverWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["customSizePopover"],
);

export const ResponseSizeWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["responseSize"],
);
