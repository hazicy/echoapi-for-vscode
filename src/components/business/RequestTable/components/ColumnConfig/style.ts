import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const DescMoreItemWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["DescMoreItemWrap"],
  {
    selector: "ui_42e19a8d_DescMoreItemWrap",
    attrs: {
      align: "center",
      justify: "space-between",
    },
  },
);

export const ColumnConfigContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ColumnConfigContainer"],
  { selector: "ui_42e19a8d_ColumnConfigContainer" },
);
