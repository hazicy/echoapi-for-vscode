import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const DocWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["DocWrap"],
  { selector: "ui_2c3d295d_DocWrap" },
);
