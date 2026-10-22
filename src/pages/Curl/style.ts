import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const CurlWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["CurlWrap"],
  { selector: "ui_8df0fbee_CurlWrap" },
);
