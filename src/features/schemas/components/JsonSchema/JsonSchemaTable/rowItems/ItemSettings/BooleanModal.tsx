import slots from "@/shared/ui/base/slots.module.css";
import { useTranslation } from 'react-i18next';

import { Flex, Select, Switch } from '@/shared/ui/base';

const Option = Select.Option;
const BooleanModal = (props: any) => {
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
        </Flex>
        {ItemMockDom && (
          <Flex gap={20}>
            <div className={slots["item-line"]}>
              <div className={slots["case-title"]}>example</div>
              <div className={slots["case-value"]}>{ItemMockDom}</div>
            </div>
          </Flex>
        )}
        <div className={slots["item-line"]}>
          <div className={slots["case-title"]}>{t('common.schema.advanced_settings.default_values')}</div>
          <div className={slots["case-value"]}>
            <Select
              value={value?.default}
              style={{ width: '100%' }}
              onChange={onChange.bind(null, 'default')}
            >
              <Option value>true</Option>
              <Option value={false}>false</Option>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default BooleanModal;
