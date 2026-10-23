import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const FlexSegmented = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const ApiDebugContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["apiDebug"],
);

export const SaveDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["saveDropDown"],
);
