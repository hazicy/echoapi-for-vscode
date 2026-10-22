import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Flex } from "@/components/ui/base";

export const FlexSegmented = withStyles<"div", {}>(
  "div",
  moduleStyles["FlexSegmented"],
  { selector: "ui_c0cea99d_FlexSegmented" },
);

export const ApiDebugContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ApiDebugContainer"],
  { selector: "ui_c0cea99d_ApiDebugContainer" },
);

export const SaveDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["SaveDropDownContainer"],
  { selector: "ui_c0cea99d_SaveDropDownContainer" },
);
