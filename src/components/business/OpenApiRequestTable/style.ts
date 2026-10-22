import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const RowItemWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["RowItemWrap"],
  { selector: "ui_a2b13c2e_RowItemWrap" },
);

export const BasicTableWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["BasicTableWrap"],
  { selector: "ui_a2b13c2e_BasicTableWrap" },
);

export const SelectFieldTypeOptionItem = withStyles<"span", {}>(
  "span",
  moduleStyles["SelectFieldTypeOptionItem"],
  { selector: "ui_a2b13c2e_SelectFieldTypeOptionItem" },
);

export const RequestTableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestTableContainer"],
  { selector: "ui_a2b13c2e_RequestTableContainer" },
);
