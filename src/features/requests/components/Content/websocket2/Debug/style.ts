import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const WsDebugContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["WsDebugContainer"],
  { selector: "ui_6e296277_WsDebugContainer" },
);

export const LineBarContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["LineBarContainer"],
  { selector: "ui_6e296277_LineBarContainer" },
);

export const SaveDropDownContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["SaveDropDownContainer"],
  { selector: "ui_6e296277_SaveDropDownContainer" },
);

export const ExampleLabelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ExampleLabelContainer"],
  { selector: "ui_6e296277_ExampleLabelContainer" },
);

export const ExampleModalContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ExampleModalContainer"],
  { selector: "ui_6e296277_ExampleModalContainer" },
);

export const ExampleListContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["ExampleListContainer"],
  { selector: "ui_6e296277_ExampleListContainer" },
);

export const WebsocketLeftPanelContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["WebsocketLeftPanelContainer"],
  { selector: "ui_6e296277_WebsocketLeftPanelContainer" },
);
