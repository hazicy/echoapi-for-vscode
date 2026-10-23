import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

// flex style function

// Unified menu style in Dropdown
export const DropdownMenuWrap = withStyles<
  "div",
  { $token: Partial<GlobalThemeToken> }
>("div", moduleStyles["DropdownMenuWrap"], {
  selector: "ui_9e906d82_DropdownMenuWrap",
});
