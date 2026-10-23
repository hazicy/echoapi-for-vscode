import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Input } from "@/shared/ui/base";

export const TitleEditInput = withStyles<typeof Input, {}>(
  Input,
  moduleStyles["container"],
);
