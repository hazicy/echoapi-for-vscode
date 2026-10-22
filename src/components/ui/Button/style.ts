import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";
import { Button } from "@/components/ui/base";

const ButtonWrap = withStyles<
  typeof Button,
  { $token: Partial<GlobalThemeToken> }
>(Button, moduleStyles["ButtonWrap"], { selector: "ui_ebbd104a_ButtonWrap" });

export default ButtonWrap;
