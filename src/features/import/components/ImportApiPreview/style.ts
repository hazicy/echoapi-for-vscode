import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Modal, Spin } from "@/shared/ui/base";

export const PreviewContainer = withStyles<typeof Modal, {}>(
  Modal,
  moduleStyles["container"],
);

export const LoadingContainer = withStyles<typeof Spin, {}>(
  Spin,
  moduleStyles["loading"],
);
