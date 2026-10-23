import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const DescMoreItemWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["container"],
  {
    attrs: {
      align: "center",
      justify: "space-between",
    },
  },
);

export const ColumnConfigContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["columnConfig"],
);
