import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ConsoleContentWrapper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const LabelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["label"],
);

export const ChildrenContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["children"],
);

export const ConsoleItemWrap = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["consoleItem"],
  {
    attrs: {
      align: "center",
    },
  },
);
