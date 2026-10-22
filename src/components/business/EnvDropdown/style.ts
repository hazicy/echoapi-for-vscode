import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const EnvDropdownWrapper = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["EnvDropdownWrapper"],
  { selector: "ui_5d025767_EnvDropdownWrapper" },
);

export const EnvDropdownRenderContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EnvDropdownRenderContainer"],
  { selector: "ui_5d025767_EnvDropdownRenderContainer" },
);

export const EnvLabel = withStyles<"div", {}>("div", moduleStyles["EnvLabel"], {
  selector: "ui_5d025767_EnvLabel",
});
