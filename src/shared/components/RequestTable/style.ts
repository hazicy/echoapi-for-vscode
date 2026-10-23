import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RowItemWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["RowItemWrap"],
  { selector: "ui_5a0771f7_RowItemWrap" },
);

export const BasicTableWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["BasicTableWrap"],
  { selector: "ui_5a0771f7_BasicTableWrap" },
);

export const SelectFieldTypeOptionItem = withStyles<"span", {}>(
  "span",
  moduleStyles["SelectFieldTypeOptionItem"],
  { selector: "ui_5a0771f7_SelectFieldTypeOptionItem" },
);

export const RequestTableContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RequestTableContainer"],
  { selector: "ui_5a0771f7_RequestTableContainer" },
);
