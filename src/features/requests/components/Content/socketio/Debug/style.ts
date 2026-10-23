import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const WsDebugContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const LineBarContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["lineBar"],
);
export const ExampleModalContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["exampleModal"],
);

export const SaveDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["saveDropDown"],
);

export const ExampleLabelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["exampleLabel"],
);

export const ExampleListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["exampleList"],
);

export const SocketIoLeftPanelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["socketIoLeftPanel"],
);
