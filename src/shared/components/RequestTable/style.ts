import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RowItemWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const BasicTableWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["basicTable"],
);

export const SelectFieldTypeOptionItem = withStyles<"span", {}>(
  "span",
  moduleStyles["selectFieldTypeOptionItem"],
);

export const RequestTableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["requestTable"],
);
