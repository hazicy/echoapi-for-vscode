import { useTranslation } from 'react-i18next';

import { Form } from '@/shared/ui/base';

import VarInput from '@/features/variables/components/VarInput';
import { AUTH_ENUM } from '@/features/requests/constants/auth';

const Bearer = () => {
  const { t } = useTranslation();
  return (
    <>
      <Form.Item label="Token" name={[AUTH_ENUM.BEARER, 'key']}>
        <VarInput
          enableNewRow
          maxLength={10240}
          hasBorder
          placeholder={t('common.auth.token_tip')}
        />
      </Form.Item>
    </>
  );
};

export default Bearer;
