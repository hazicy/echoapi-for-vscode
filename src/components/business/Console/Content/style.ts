import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const ConsoleContentWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["ConsoleContentWrapper"],
  { selector: "ui_0c40a20c_ConsoleContentWrapper" },
);

export const LabelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["LabelContainer"],
  { selector: "ui_0c40a20c_LabelContainer" },
);

export const ChildrenContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ChildrenContainer"],
  { selector: "ui_0c40a20c_ChildrenContainer" },
);

export const ConsoleItemWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ConsoleItemWrap"],
  {
    selector: "ui_0c40a20c_ConsoleItemWrap",
    attrs: {
      align: "center",
    },
  },
);
