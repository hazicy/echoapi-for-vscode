import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import { DirectionType } from "@/shared/types/common";

export const RequestContainer = withStyles<
  "div",
  { $direction: DirectionType }
>("div", moduleStyles["container"], {
  variables: {
    "--style-fa30f745-RequestContainer-0": (props) =>
      String(
        (({ $direction }) => ($direction === "vertical" ? 12 : 0))(props),
      ) + "px",
  },
});
