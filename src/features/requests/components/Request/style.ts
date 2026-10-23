import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import { DirectionType } from "@/shared/types/common";

export const RequestContainer = withStyles<
  "div",
  { $direction: DirectionType }
>("div", moduleStyles["container"], {
  variables: {
    "--style-bfdb18be-RequestContainer-0": (props) =>
      String(
        (({ $direction }) => ($direction === "vertical" ? 12 : 6))(props),
      ) + "px",
  },
});
