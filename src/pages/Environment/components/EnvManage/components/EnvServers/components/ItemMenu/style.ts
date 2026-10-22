import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const DeleteContainer = withStyles<"div", { $disable: boolean }>(
  "div",
  moduleStyles["DeleteContainer"],
  {
    selector: "ui_0f0fd159_DeleteContainer",
    variables: {
      "--style-0f0fd159-DeleteContainer-0": (props) =>
        props?.$disable && "not-allowed",
      "--style-0f0fd159-DeleteContainer-1": (props) =>
        !props?.$disable && " var(--color-primary)",
    },
  },
);

export const EditContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EditContainer"],
  { selector: "ui_0f0fd159_EditContainer" },
);
