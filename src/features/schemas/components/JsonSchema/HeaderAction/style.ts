import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const HeaderActionWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["container"]);

export const ImportContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["import"]);

export const EditRawContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["editRaw"],
);

export const PreviewContainer = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["preview"]);

export const PreviewTitleContainer = withStyles<"div", {}>(
  "div",
  moduleStyles["previewTitle"],
);
