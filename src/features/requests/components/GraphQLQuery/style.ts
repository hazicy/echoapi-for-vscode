import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const GraphQLContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["GraphQLContainer"],
  { selector: "ui_41eb05db_GraphQLContainer" },
);

export const MainContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["MainContainer"],
  { selector: "ui_41eb05db_MainContainer" },
);

export const SchemaTreeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["SchemaTreeContainer"],
  { selector: "ui_41eb05db_SchemaTreeContainer" },
);
export const TitleRenderContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["TitleRenderContainer"],
  { selector: "ui_41eb05db_TitleRenderContainer" },
);

export const PopoverAddContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["PopoverAddContainer"],
  { selector: "ui_41eb05db_PopoverAddContainer" },
);

export const PopoverFilterContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["PopoverFilterContainer"],
  { selector: "ui_41eb05db_PopoverFilterContainer" },
);

export const FilterContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["FilterContainer"],
  { selector: "ui_41eb05db_FilterContainer" },
);
