import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const ListSideBarContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ListSideBarContainer"],
  { selector: "ui_3c35b050_ListSideBarContainer" },
);
