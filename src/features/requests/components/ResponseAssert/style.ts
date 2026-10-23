import slots from "@/shared/ui/base/slots.module.css";
import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import { hexToRGBA } from "@/shared/utils/common";

export const ResponseAssertionContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ResponseAssertionContainer"],
  { selector: "ui_f9a1fed8_ResponseAssertionContainer" },
);

interface AssertItemProps {
  $status: boolean;
}

export const ResponseAssertItemContainer = withStyles<"span", AssertItemProps>(
  "span",
  moduleStyles["ResponseAssertItemContainer"],
  {
    selector: "ui_f9a1fed8_ResponseAssertItemContainer",
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
  moduleStyles["BodyListContainer"],
  { selector: "ui_f9a1fed8_BodyListContainer" },
);

export const ScriptErrorContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ScriptErrorContainer"],
  {
    selector: "ui_f9a1fed8_ScriptErrorContainer",
    attrs: {
      className: slots["content-item"],
    },
  },
);
