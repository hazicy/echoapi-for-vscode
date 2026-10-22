import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

export const LinkWarper = withStyles<"div", {}>(
  "div",
  moduleStyles["LinkWarper"],
  { selector: "ui_e0b1c5a7_LinkWarper" },
);

export const Footer = withStyles<"div", {}>("div", moduleStyles["Footer"], {
  selector: "ui_e0b1c5a7_Footer",
});
