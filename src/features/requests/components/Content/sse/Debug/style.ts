import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const ApiDebugContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["ApiDebugContainer"],
  { selector: "ui_fac039fb_ApiDebugContainer" },
);

export const RequestContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestContainer"],
  { selector: "ui_fac039fb_RequestContainer" },
);
