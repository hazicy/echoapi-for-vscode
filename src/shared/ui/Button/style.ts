import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Button } from "@/shared/ui/base";

const ButtonWrap = withStyles<
  typeof Button,
  { $token: Partial<GlobalThemeToken> }
>(Button, moduleStyles["container"]);

export default ButtonWrap;
