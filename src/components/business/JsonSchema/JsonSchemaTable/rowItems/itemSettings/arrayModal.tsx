import slots from "@/components/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import { Flex, InputNumber, Switch } from '@/components/ui/base';

import { isNumber } from 'lodash';

const ArrayModal = (props: any) => {
  const {
    value,
    onChange,
    handleUpdateRequired,
    isRequired,
    empty,
    handleChangeAllowNull,
    SelectTypeDom,
    ItemMockDom,
  } = props;
  const { t } = useTranslation();
  return (
    <>
      <div className={slots["base-setting"]}>
        <div className={slots["item-line"]}>{SelectTypeDom}</div>
        <Flex gap={20} className={[slots["item-all-line"], slots["item-necessarily"]].join(" ")}>
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.required')}
            <Switch
              size="small"
              onChange={() => handleUpdateRequired(isRequired)}
              value={isRequired}
            />
          </Flex>
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.null')}
            <Switch size="small" value={empty} onChange={handleChangeAllowNull} />
          </Flex>
          <Flex align="center" gap={8}>
            {t('common.schema.advanced_settings.unique_item')}
            <Switch
              size="small"
              checked={value?.uniqueItems}
              onChange={onChange.bind(null, 'uniqueItems')}
            />
          </Flex>
        </Flex>
        {ItemMockDom && (
          <Flex gap={20}>
            <div className={slots["item-line"]}>
              <div className={slots["case-title"]}>Example</div>
              <div className={slots["case-value"]}>{ItemMockDom}</div>
            </div>
          </Flex>
        )}
        <Flex gap={20}>
          <div className={slots["item-line"]}>
            <div className={slots["case-title"]}>{t('common.schema.advanced_settings.min_item')}</div>
            <div className={slots["case-value"]}>
              <InputNumber
                size="small"
                min={0}
                value={isNumber(value?.minItems) ? value?.minItems : 0}
                onChange={onChange.bind(null, 'minItems')}
              />
            </div>
          </div>
        </Flex>
        <Flex gap={20}>
          <div className={slots["item-line"]}>
            <div className={slots["case-title"]}>{t('common.schema.advanced_settings.max_item')}</div>
            <div className={slots["case-value"]}>
              <InputNumber
                min={0}
                size="small"
                value={isNumber(value?.maxItems) ? value?.maxItems : 0}
                onChange={onChange.bind(null, 'maxItems')}
              />
            </div>
          </div>
        </Flex>
      </div>
    </>
  );
};

export default ArrayModal;
