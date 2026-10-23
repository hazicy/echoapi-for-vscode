import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const SegmentedTabsContainer = withStyles<
  typeof Flex,
  { $token: Partial<GlobalThemeToken> }
>(Flex, moduleStyles["container"]);
