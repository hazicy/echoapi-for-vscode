import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ExportDataWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ExportDataWrap"],
  { selector: "ui_f28d9eee_ExportDataWrap" },
);
