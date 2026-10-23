import { FC } from 'react';

import produce from 'immer';

import RequestTable from '@/shared/components/RequestTable';
import { ApisBaseDataItem } from '@/features/requests/types/base';

import { RequestBodyProps } from '../../types';
import { useTableColumnSwitchConfig } from '@/shared/hooks';


const RequestBodyFormData: FC<RequestBodyProps> = (props) => {
  const { value, onChange, ...otherProps } = props;

  const { columnSwitchConfig, onColumnSwitchConfig } = useTableColumnSwitchConfig(
    'request_body_column_switch'
  );


  const handleOnChange = (newValue: ApisBaseDataItem[]) => {
    const newData = produce(value, (draft: any) => {
      draft!.parameter = newValue;
    });

    onChange?.('body', newData);
  };
  
  return (
    <RequestTable
      {...otherProps}
      bodyMode={value?.mode || 'none'}
      dataSource={value?.parameter || []}
      onChange={handleOnChange}
      columnSwitchConfig={columnSwitchConfig}
      onColumnSwitchConfig={onColumnSwitchConfig}
    />
  );
};

export default RequestBodyFormData;
