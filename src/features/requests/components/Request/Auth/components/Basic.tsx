import { useTranslation } from "react-i18next";

import { Form } from "@/shared/ui/base";

import VarInput from "@/features/variables/components/VarInput";
import { AUTH_ENUM } from "@/features/requests/constants/auth";

const Basic = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item label="Username" name={[AUTH_ENUM.BASIC, "username"]}>
        <VarInput
          enableNewRow
          hasBorder
          placeholder={t("common.auth.username_tip")}
        />
      </Form.Item>
      <Form.Item label="Password" name={[AUTH_ENUM.BASIC, "password"]}>
        <VarInput
          enableNewRow
          hasBorder
          placeholder={t("common.auth.pwd_tip")}
        />
      </Form.Item>
    </>
  );
};

export default Basic;
