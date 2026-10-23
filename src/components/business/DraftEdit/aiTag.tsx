import slots from "@/components/ui/base/slots.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';

import AiDescIcon from '@/assets/icon/aidesc.png';
import { Tooltip } from '@/components/ui';
import CustomPopover from '@/components/ui/Popover';
import useTheme from '@/hooks/useTheme';

import { ContainerWrap } from './style';

interface Props {
  text: string;
  children: React.ReactNode;
}

const Index = (props: Props) => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();
  const tipsElement = (
    <ContainerWrap $token={themeToken}>
      <div className={slots["item-title"]}>
        <div className={[slots["pop-var-icon"], slots.fixed].join(" ")}>
          <img width={16} src={AiDescIcon} />
        </div>
        <div className={[slots["pop-var-title"], slots.green].join(" ")}>
          <Tooltip title={t('var_insert.ai_value')}>{t('var_insert.ai_value')}</Tooltip>
        </div>
      </div>
      <div className={slots["item-var"]}>
        <div className={slots["var-value"]}>{t('var_insert.send_random')}</div>
      </div>
    </ContainerWrap>
  );

  return (
    <>
      <CustomPopover placement="bottomLeft" content={tipsElement}>
        {props.children}
      </CustomPopover>
    </>
  );
};

export default Index;
