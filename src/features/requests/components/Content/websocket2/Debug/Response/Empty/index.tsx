import slots from "@/shared/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import { Flex } from '@/shared/ui/base';

import cn from 'classnames';

import Empty from '@/shared/ui/Empty';
import IconFont from '@/shared/ui/IconFont';
import { CLIENT_DOWNLOAD_URL } from '@/shared/constants/common';
import { openUrl } from '@/shared/utils/open';

import { ResponseEmptyContainer } from './style';

type ResponseEmpty = {
  description?: string;
  maskMode?: boolean;
};

const ResponseEmpty = ({ description, maskMode = false }: ResponseEmpty) => {
  const { t } = useTranslation();

  const defaultDescription = (
    <Flex gap={4} vertical>
      <span>{t('api.run.response_tip')}</span>
      <span>{t('api.run.response_tip_cors')}</span>
      <span>
        {t('api.run.response_tip_local')}
        <span className={slots["empty-desc-download"]} onClick={() => openUrl(CLIENT_DOWNLOAD_URL)}>
          {t('api.run.response_tip_down')}
        </span>
      </span>
    </Flex>
  );

  return (
    <ResponseEmptyContainer className={cn({ [slots["mask-mode"]]: maskMode })}>
      <Empty
        className={slots["response-empty-wrap"]}
        description={description || defaultDescription}
        image={<IconFont type="icon-zanwu" className={slots["icon-empty-wrap"]} />}
      />
    </ResponseEmptyContainer>
  );
};

export default ResponseEmpty;
