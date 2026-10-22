import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

import { DirectionType } from "@/types/common";

export const RequestContainer = withStyles<
  "div",
  { $direction: DirectionType }
>("div", moduleStyles["RequestContainer"], {
  selector: "ui_bfdb18be_RequestContainer",
  variables: {
    "--style-bfdb18be-RequestContainer-0": (props) =>
      String(
        (({ $direction }) => ($direction === "vertical" ? 12 : 6))(props),
      ) + "px",
  },
});
