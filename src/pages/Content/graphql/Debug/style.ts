import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const GraphqlDebugContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["GraphqlDebugContainer"],
  { selector: "ui_e8caf18d_GraphqlDebugContainer" },
);
