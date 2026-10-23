import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ImportDataWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ImportDataWrap"],
  { selector: "ui_ad16818e_ImportDataWrap" },
);
