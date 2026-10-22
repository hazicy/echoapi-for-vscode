import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const SelectOtherItemWrapper = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["SelectOtherItemWrapper"],
  { selector: "ui_30b93478_SelectOtherItemWrapper" },
);
