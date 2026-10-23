import slots from "@/components/ui/base/slots.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Space } from '@/components/ui/base';

import IconFont from '@/components/ui/IconFont';
import { openUrl } from '@/utils/open';

import { BodyListContainer, ResponseAssertItemContainer } from '../style';

interface BodyListProps {
  isSuccess: boolean;
  errList: any[];
}

const BodyList: React.FC<BodyListProps> = (props) => {
  const { isSuccess, errList } = props;
  const { t } = useTranslation();
  return (
    <BodyListContainer>
      <div className="assert-list">
        {errList?.map((item, index) => (
          <ResponseAssertItemContainer key={index} $status={item.status} className={slots["content-item"]}>
            <Space>
              {item.status === 'success' ? (
                <IconFont type="icon-checked" />
              ) : (
                <IconFont type="icon-error" />
              )}
              {item.expect}
            </Space>
          </ResponseAssertItemContainer>
        ))}
      </div>
    </BodyListContainer>
  );
};

export default BodyList;
