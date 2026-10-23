import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Input } from "@/shared/ui/base";

export const TitleEditInput = withStyles<typeof Input, {}>(
  Input,
  moduleStyles["TitleEditInput"],
  { selector: "ui_118b9e16_TitleEditInput" },
);
