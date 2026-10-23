import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ContentContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const TreeDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["treeDropDown"],
);

export const TreeTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["treeTitle"],
);

export const TreeValueContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["treeValue"],
);
