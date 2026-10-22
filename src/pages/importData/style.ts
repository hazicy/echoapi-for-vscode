import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const ImportDataWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ImportDataWrap"],
  { selector: "ui_ad16818e_ImportDataWrap" },
);
