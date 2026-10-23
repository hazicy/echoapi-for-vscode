import slots from "@/shared/ui/base/slots.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Space } from '@/shared/ui/base';

import { isArray } from 'lodash';

import { CheckCircleFilled, CloseCircleFilled } from '@/shared/ui/base/Icons';
import IconFont from '@/shared/ui/IconFont';
import { ApiSendingData } from '@/features/requests/types/send';

import { ResponseAssertItemContainer } from '../style';

interface ListProps {
  asserts?: ApiSendingData['asserts'];
}

const List: React.FC<ListProps> = ({ asserts }) => {
  const { t } = useTranslation();
  return (
    <>
      {isArray(asserts) && asserts.length > 0 && (
        <>
          <div className={slots["content-title"]}>{t('common.assertion.tag')}</div>
          <div className="assert-list">
            {asserts?.map((item, index) => (
              <ResponseAssertItemContainer
                key={index}
                $status={!!item?.passed}
                className={slots["content-item"]}
              >
                <Space>
                  {item?.passed ? <CheckCircleFilled /> : <CloseCircleFilled />}
                  <span>
                    {item?.passed ? item?.name : `${item?.name}: ${item?.error?.message}`}
                  </span>
                </Space>
              </ResponseAssertItemContainer>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default List;
