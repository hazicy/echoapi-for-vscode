import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const HeaderActionWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["HeaderActionWrap"], {
  selector: "ui_aa6c879e_HeaderActionWrap",
});

export const ImportContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["ImportContainer"], {
  selector: "ui_aa6c879e_ImportContainer",
});

export const EditRawContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["EditRawContainer"],
  { selector: "ui_aa6c879e_EditRawContainer" },
);

export const PreviewContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["PreviewContainer"], {
  selector: "ui_aa6c879e_PreviewContainer",
});

export const PreviewTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["PreviewTitleContainer"],
  { selector: "ui_aa6c879e_PreviewTitleContainer" },
);
