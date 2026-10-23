import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const CurlWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["container"],
);
