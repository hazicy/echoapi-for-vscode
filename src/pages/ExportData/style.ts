import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const ExportDataWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ExportDataWrap"],
  { selector: "ui_f28d9eee_ExportDataWrap" },
);
