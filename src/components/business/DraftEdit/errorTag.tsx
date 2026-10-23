import slots from "@/components/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@/components/ui';
import IconFont from '@/components/ui/IconFont';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';

import { ContainerWrap } from './style';

const EnvTag = (props: { decoratedText?: string; children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      <div className={slots["item-title"]}>
        <div className={[slots["pop-var-icon"], slots.error].join(" ")}>
          <IconFont type="icon-warn" style={{ color: 'red' }} />
        </div>
        <div className={[slots["pop-var-title"], slots.red].join(" ")}>
          <Tooltip title={t('supplement.un_var')}>{t('supplement.un_var')}</Tooltip>
        </div>
      </div>
      <div className={slots["item-desc"]}>{t('supplement.aha_var')}</div>
    </ContainerWrap>
  );
  return (
    <CustomPopover placement="bottomLeft" className="tag-error-tooltip" content={tipsElement}>
      <span className={slots["tag-error"]}>{props.children}</span>
    </CustomPopover>
  );
};

export default EnvTag;
