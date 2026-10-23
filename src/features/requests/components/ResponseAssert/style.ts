import slots from "@/shared/ui/base/slots.module.css";
import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import { hexToRGBA } from "@/shared/utils/common";

export const ResponseAssertionContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

interface AssertItemProps {
  $status: boolean;
}

export const ResponseAssertItemContainer = withStyles<"span", AssertItemProps>(
  "span",
  moduleStyles["responseAssertItem"],
  {
    variables: {
      "--style-f9a1fed8-ResponseAssertItemContainer-0": (props) =>
        props?.$status ? "#26CEA4" : "#FF583E",
      "--style-f9a1fed8-ResponseAssertItemContainer-1": (props) =>
        props?.$status ? hexToRGBA("#26CEA4", 0.1) : hexToRGBA("#FF583E", 0.1),
    },
  },
);

export const BodyListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["bodyList"],
);

export const ScriptErrorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["scriptError"],
  {
    attrs: {
      className: slots["content-item"],
    },
  },
);
