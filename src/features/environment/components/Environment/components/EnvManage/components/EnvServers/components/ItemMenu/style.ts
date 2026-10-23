import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const DeleteContainer = withStyles<"div", { $disable: boolean }>(
  "div",
  moduleStyles["container"],
  {
    variables: {
      "--style-0f0fd159-DeleteContainer-0": (props) =>
        props?.$disable && "not-allowed",
      "--style-0f0fd159-DeleteContainer-1": (props) =>
        !props?.$disable && " var(--color-primary)",
    },
  },
);

export const EditContainer = withStyles<"div", {}>("div", moduleStyles["edit"]);
