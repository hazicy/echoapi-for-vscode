import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const DocWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["DocWrap"],
  { selector: "ui_2c3d295d_DocWrap" },
);
