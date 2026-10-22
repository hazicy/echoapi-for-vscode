import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

import { DirectionType } from "@/types/common";

export const RequestContainer = withStyles<
  "div",
  { $direction: DirectionType }
>("div", moduleStyles["RequestContainer"], {
  selector: "ui_184ec0bc_RequestContainer",
  variables: {
    "--style-184ec0bc-RequestContainer-0": (props) =>
      String(
        (({ $direction }) => ($direction === "vertical" ? 12 : 0))(props),
      ) + "px",
  },
});
