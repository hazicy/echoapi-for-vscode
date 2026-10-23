import "../style.css";
import styles from "../style.module.css";
import { useTranslation } from "react-i18next";

import { Form, Input } from "@/shared/ui/base";

import { map } from "lodash";

import GhostCollapse from "@/shared/ui/GhostCollapse";
import { AUTH_ENUM } from "@/features/requests/constants/auth";

const fieldList = [
  { label: "Access Token", name: "accessToken", placeholder: "Access Token" },
  { label: "Client Token", name: "clientToken", placeholder: "Client Token" },
  {
    label: "Client Secret",
    name: "clientSecret",
    placeholder: "Client Secret",
  },
];

const moreFieldList = [
  { label: "Nonce", name: "nonce", placeholder: "Nonce" },
  { label: "Timestamp", name: "timestamp", placeholder: "Timestamp" },
  { label: "Base URi", name: "baseURi", placeholder: "Base Url" },
  {
    label: "Headers to Sign",
    name: "headersToSign",
    placeholder: "Header To Sign",
  },
];

const Edgegrid = () => {
  const { t } = useTranslation();
  return (
    <>
      {map(fieldList, (item) => (
        <Form.Item label={item.label} name={[AUTH_ENUM.EDGEGRID, item.name]}>
          <Input.TextArea autoSize placeholder={item.placeholder} />
        </Form.Item>
      ))}
      <GhostCollapse
        items={[
          {
            key: "edgegrid-more",
            label: (
              <span className={styles.moreTip}>{t("common.auth.more")}</span>
            ),
            children: (
              <>
                <span className="auth-tips">{t("common.auth.more_tip")}</span>
                {map(moreFieldList, (item) => (
                  <Form.Item
                    label={item.label}
                    name={[AUTH_ENUM.EDGEGRID, item.name]}
                  >
                    <Input.TextArea autoSize placeholder={item.placeholder} />
                  </Form.Item>
                ))}
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default Edgegrid;
