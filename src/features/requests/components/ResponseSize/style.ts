import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const CustomPopoverWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["CustomPopoverWrap"],
  { selector: "ui_c7dcbf0f_CustomPopoverWrap" },
);

export const CustomProxyWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["CustomProxyWrap"],
  { selector: "ui_c7dcbf0f_CustomProxyWrap" },
);

export const CustomCodePopoverWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["CustomCodePopoverWrap"],
  { selector: "ui_c7dcbf0f_CustomCodePopoverWrap" },
);

export const CustomSizePopoverWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["CustomSizePopoverWrap"],
  { selector: "ui_c7dcbf0f_CustomSizePopoverWrap" },
);

export const ResponseSizeWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ResponseSizeWrap"],
  { selector: "ui_c7dcbf0f_ResponseSizeWrap" },
);
