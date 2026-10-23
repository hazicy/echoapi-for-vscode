import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Tag } from "@/shared/ui/base";

export const ApisTypeTag = withStyles<typeof Tag, {}>(
  Tag,
  moduleStyles["container"],
);
