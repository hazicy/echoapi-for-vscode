import slots from "@/shared/ui/base/slots.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedProps, Typography } from '@/shared/ui/base';

import { useMemoizedFn, useSafeState } from 'ahooks';

import SegmentedTabs from '@/shared/components/SegmentedTabs';

import CommonTable from './CommonTable';

import { RealRequestContainer, RequestItem } from './style';

const { Text } = Typography;

interface Props {
  sendingData?: any;
}

const RealRequest: React.FC<Props> = ({ sendingData }) => {
  const { t } = useTranslation();
  const [tabsValue, setTabsValue] = useSafeState<string | number>('header');

  const handleOptionsChange: SegmentedProps['onChange'] = useMemoizedFn((value) => {
    setTabsValue(value);
  });

  const segmentedOptions = [
    {
      value: 'header',
      label: 'header',
      children: <CommonTable value={sendingData?.request?.headers || []} />,
    },
    {
      value: 'query',
      label: 'query',
      children: <CommonTable value={sendingData?.request?.query || []} />,
    },
  ];

  return (
    <RealRequestContainer>
      <RequestItem>
        <Text className={slots.title}>{t('supplement.req_url')}</Text>
        <div className={[slots["content-warp"], slots["base-info-wrap"]].join(" ")}>
          <Flex align="flex-start">
            <div className={slots.url}>{sendingData?.url}</div>
          </Flex>
        </div>
      </RequestItem>
      <RequestItem>
        <Text className={slots.title}>{t('supplement.req_param')}</Text>
        <div className={[slots["content-warp"], slots["content-request"]].join(" ")}>
          <SegmentedTabs
            options={segmentedOptions}
            value={tabsValue}
            onChange={handleOptionsChange}
          />
        </div>
      </RequestItem>
    </RealRequestContainer>
  );
};

export default RealRequest;
