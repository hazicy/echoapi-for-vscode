import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";

import Modal from "@/shared/ui/Modal";

export const PathPickModalContainer = withStyles<typeof Modal, {}>(
  Modal,
  moduleStyles["container"],
);
