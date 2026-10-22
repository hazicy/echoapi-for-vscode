import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Input } from "@/components/ui/base";

export const TitleEditInput = withStyles<typeof Input, {}>(
  Input,
  moduleStyles["TitleEditInput"],
  { selector: "ui_118b9e16_TitleEditInput" },
);
