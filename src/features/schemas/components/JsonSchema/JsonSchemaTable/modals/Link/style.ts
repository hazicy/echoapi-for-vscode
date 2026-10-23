import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

export const LinkWarper = withStyles<"div", {}>(
  "div",
  moduleStyles["container"],
);

export const Footer = withStyles<"div", {}>("div", moduleStyles["footer"]);
