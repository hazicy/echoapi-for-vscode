import slots from "@/shared/ui/base/slots.module.css";
import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RealtimeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const FlowResponseRenderTitleWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["flowResponseRenderTitle"],
  {
    attrs: { className: slots.title },
  },
);

export const PanelsWrap = withStyles<"div", {}>("div", moduleStyles["panels"]);
