import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Alert } from "@/shared/ui/base";

export const AlertTextWrap = withStyles<typeof Alert, {}>(
  Alert,
  moduleStyles["AlertTextWrap"],
  { selector: "ui_82de3bbb_AlertTextWrap" },
);
