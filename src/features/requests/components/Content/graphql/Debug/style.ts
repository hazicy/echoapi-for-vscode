import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const GraphqlDebugContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["GraphqlDebugContainer"],
  { selector: "ui_e8caf18d_GraphqlDebugContainer" },
);
