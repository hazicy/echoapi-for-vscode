import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ListSideBarContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ListSideBarContainer"],
  { selector: "ui_5ffb238c_ListSideBarContainer" },
);
