import slots from "@/shared/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import { Typography } from '@/shared/ui/base';

import IconFont from '@/shared/ui/IconFont';

import { InvalidUrlWrapper } from './style';

type InvalidUrlProps = {
  url: string;
};

export const InvalidUrl = ({ url }: InvalidUrlProps) => {
  const { t } = useTranslation();
  return (
    <InvalidUrlWrapper vertical gap={12} align="center" justify="center">
      <IconFont className={slots.icon} type="icon-qingqiucuowu" />
      <Typography.Text className={slots.text}>
        {t('supplement.invalid_url')} {url}
      </Typography.Text>
    </InvalidUrlWrapper>
  );
};
