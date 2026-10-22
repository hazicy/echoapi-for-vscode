import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

import { DirectionType } from "@/types/common";

export const RequestContainer = withStyles<
  "div",
  { $direction: DirectionType }
>("div", moduleStyles["RequestContainer"], {
  selector: "ui_fa30f745_RequestContainer",
  variables: {
    "--style-fa30f745-RequestContainer-0": (props) =>
      String(
        (({ $direction }) => ($direction === "vertical" ? 12 : 0))(props),
      ) + "px",
  },
});
