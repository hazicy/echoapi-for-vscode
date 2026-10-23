import slots from "@/shared/ui/base/slots.module.css";
import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const RealtimeContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["RealtimeContainer"],
  { selector: "ui_42227ec2_RealtimeContainer" },
);

export const FlowResponseRenderTitleWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["FlowResponseRenderTitleWrap"],
  {
    selector: "ui_42227ec2_FlowResponseRenderTitleWrap",
    attrs: { className: slots.title },
  },
);

export const PanelsWrap = withStyles<"div", {}>(
  "div",
  moduleStyles["PanelsWrap"],
  { selector: "ui_42227ec2_PanelsWrap" },
);
