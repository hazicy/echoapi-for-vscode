import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const SegmentedTabsContainer = withStyles<
  typeof Flex,
  { $token: Partial<GlobalThemeToken> }
>(Flex, moduleStyles["SegmentedTabsContainer"], {
  selector: "ui_1ce84259_SegmentedTabsContainer",
});
