import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Flex } from "@/shared/ui/base";

export const GraphQLContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["container"],
);

export const MainContainer = withStyles<"div", {}>("div", moduleStyles["main"]);

export const SchemaTreeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["schemaTree"],
);
export const TitleRenderContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["titleRender"],
);

export const PopoverAddContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["popoverAdd"],
);

export const PopoverFilterContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["popoverFilter"],
);

export const FilterContainer = withStyles<typeof Flex, {}>(
  Flex,
  moduleStyles["filter"],
);
