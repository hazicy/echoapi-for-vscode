import styles from "./style.module.css";
import slots from "@/shared/ui/base/slots.module.css";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Flex, Tooltip } from "@/shared/ui/base";

import { isObject } from "lodash";

import Button from "@/shared/ui/Button";
import IconFont from "@/shared/ui/IconFont";
import useTheme from "@/shared/hooks/useTheme";

import EditRow from "./modals/EditRaw";
import ImportModal from "./modals/ImportModal";
import PreviewModal from "./modals/PreviewModal";

type Props = {
  value: any;
  onChange: (newVal: any) => void;
  importTitle?: string;
  style?: React.CSSProperties;
};

const HeaderAction: React.FC<Props> = (props) => {
  const { value, onChange, importTitle, style } = props;
  const { themeToken } = useTheme();
  const [modalType, setModalType] = useState("");
  const shemaData = isObject(value) ? value : {};
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      {modalType === "import" && (
        <ImportModal
          themeToken={themeToken}
          onChange={onChange}
          onCancel={() => setModalType("")}
        />
      )}
      {modalType === "preview" && (
        <PreviewModal
          themeToken={themeToken}
          value={value}
          onCancel={() => setModalType("")}
        />
      )}
      {modalType === "edit-raw" && (
        <EditRow
          value={shemaData}
          onChange={onChange}
          onCancel={() => setModalType("")}
        />
      )}

      <div className={slots["action-right"]} style={style}>
        <Flex gap={8}>
          <Tooltip title={t("common.schema.raw")}>
            <IconFont
              style={{ color: "var(--icon-color)", cursor: "pointer" }}
              onClick={() => setModalType("edit-raw")}
              type="icon-edit"
            />
          </Tooltip>

          <Tooltip title={t("common.schema.view")}>
            <IconFont
              style={{ color: "var(--icon-color)", cursor: "pointer" }}
              onClick={() => setModalType("preview")}
              type="icon-preview"
            />
          </Tooltip>

          <Button
            icon={<IconFont type="icon-import-curl" />}
            mode="light"
            size="small"
            className={slots["preview-btn"]}
            type="primary"
            onClick={() => setModalType("import")}
          >
            {importTitle || t("supplement.imp")}
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default memo(HeaderAction);
