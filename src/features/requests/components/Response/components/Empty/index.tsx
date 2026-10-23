import slots from "@/shared/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import cn from 'classnames';

import Empty from '@/shared/ui/Empty';
import IconFont from '@/shared/ui/IconFont';

import { ResponseEmptyContainer } from './style';

type ResponseEmpty = {
  description?: string;
  maskMode?: boolean;
  wrapClassName?: string;
};

const ResponseEmpty = ({ description, maskMode = false, wrapClassName }: ResponseEmpty) => {
  const { t } = useTranslation();
  return (
    <ResponseEmptyContainer className={cn({ [slots["mask-mode"]]: maskMode }, wrapClassName)} >
      <Empty
        className={slots["response-empty-wrap"]}
        description={description || t('api.run.response_tip')}
        image={<IconFont type="icon-zanwu" className={slots["icon-empty-wrap"]} />}
      />
    </ResponseEmptyContainer>
  );
};

export default ResponseEmpty;
