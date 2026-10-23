import moduleStyles from "./style.module.css";
import { withStyles } from "@/shared/ui/base/withStyles";
import { Modal, Spin } from "@/shared/ui/base";

export const PreviewContainer = withStyles<typeof Modal, {}>(
  Modal,
  moduleStyles["PreviewContainer"],
  { selector: "ui_848512ea_PreviewContainer" },
);

export const LoadingContainer = withStyles<typeof Spin, {}>(
  Spin,
  moduleStyles["LoadingContainer"],
  { selector: "ui_848512ea_LoadingContainer" },
);
