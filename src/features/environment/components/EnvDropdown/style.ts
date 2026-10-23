import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const EnvDropdownWrapper = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["container"],
);

export const EnvDropdownRenderContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["envDropdownRender"],
);

export const EnvLabel = withStyles<"div", {}>("div", moduleStyles["envLabel"]);
