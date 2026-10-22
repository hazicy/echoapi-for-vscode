import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const FakerParamsContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["FakerParamsContainer"],
  { selector: "ui_f425c604_FakerParamsContainer" },
);
