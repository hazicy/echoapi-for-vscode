import slots from "@/shared/ui/base/slots.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown, Flex } from '@/shared/ui/base';

import Button from '@/shared/ui/Button';
import IconFont from '@/shared/ui/IconFont';

type Props = {
  enableDel: boolean;
  onDelete: () => void;
  onModify: () => void;
  onDefault: () => void;
};

const Index: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { enableDel, onDelete, onModify, onDefault } = props;

  const handleModify = () => {
    onModify();
  };

  const handleDelete = () => {
    if (!enableDel) {
      return;
    }
    onDelete();
  };

  const handleDefault = () => {
    onDefault();
  }

  const items = [
    {
      key: '0',
      label: 'Set Default',
      icon: <IconFont type='icon-arrow' />,
      onClick: handleDefault,
    },
    {
      key: '1',
      label: t('global_setting.environment_detail.edit_name'),
      icon: <IconFont type='icon-edit' />,
      onClick: handleModify,
    },
    {
      key: '2',
      label: (
        <Flex style={{ cursor: enableDel === false ? 'not-allowed' : '' }}>
          {t('global_setting.environment_detail.delete_server')}
        </Flex>
      ),
      icon: <IconFont type='icon-delete' />,
      onClick: handleDelete,
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={['click']}
    >
      <div className={slots["env-more"]}>
        <IconFont type="icon-navi-more" />
      </div>
    </Dropdown>
  );
};

export default Index;
