import slots from "@/components/ui/base/slots.module.css";
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/base';

import cn from 'classnames';
import { isPlainObject } from 'lodash';

import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';

import { ItemModelWarperContainer } from './style';

interface Props {
  value: any;
  overrideData: any;
  onShow: () => void;
  onHide: () => void;
  onLinkItem: () => void;
  onCancelLinkItem: () => void;
  onChange: (key: string, newVal: string) => void;
}

const ItemMock: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { value, overrideData, onShow, onHide, onLinkItem, onCancelLinkItem, onChange } = props;

  const isUnLinkState = isPlainObject(overrideData);

  return (
    <div className={cn(slots["schema-td"], slots["table-td"])}>
      <ItemModelWarperContainer>
        {isUnLinkState ? (
          <>
            <Input
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
              }}
              size="small"
              value={value?.description}
              onChange={(e) => {
                onChange('description', e.target.value);
              }}
            />
            <Tooltip title={t('supplement.reallocate')}>
              <Button size="small" onClick={onLinkItem}>
                {t('supplement.reallocate')}
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Input
              size="small"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
              }}
              disabled
              value={value?.description}
            />
            <Button onClick={onCancelLinkItem} className={slots["btn-hide"]} size="small">
              {t('supplement.disassociate')}
            </Button>
            {overrideData === null ? (
              <Button onClick={onShow} className={slots["btn-hide"]} size="small">
                {t('supplement.show_field')}
              </Button>
            ) : (
              <Button onClick={onHide} className={slots["btn-hide"]} size="small">
                {t('supplement.hide_field')}
              </Button>
            )}
          </>
        )}
      </ItemModelWarperContainer>
    </div>
  );
};

export default memo(ItemMock);
