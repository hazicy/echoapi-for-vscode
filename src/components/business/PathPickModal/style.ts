import moduleStyles from "./style.module.css";
import { withStyles } from "@/components/ui/base/withStyles";

import Modal from "@/components/ui/Modal";

export const PathPickModalContainer = withStyles<typeof Modal, {}>(
  Modal,
  moduleStyles["PathPickModalContainer"],
  { selector: "ui_2b22d526_PathPickModalContainer" },
);
