import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const SelectOtherItemWrapper = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["SelectOtherItemWrapper"],
  { selector: "ui_30b93478_SelectOtherItemWrapper" },
);
