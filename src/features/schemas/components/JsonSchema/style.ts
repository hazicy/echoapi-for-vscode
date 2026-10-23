import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

const DefaultStyle = withStyles<"div", {}>("div", moduleStyles["container"]);

export default DefaultStyle;
