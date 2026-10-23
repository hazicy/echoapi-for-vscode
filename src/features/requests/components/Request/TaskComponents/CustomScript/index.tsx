import { FC } from 'react';

import CustomScript from '@/features/requests/components/CustomScript';
import { SCRIPT_TYPE } from '@/features/requests/components/CustomScript/constants';
import { TaskBaseItem } from '@/features/requests/types/request';

interface Props {
  mode: SCRIPT_TYPE;
  value: TaskBaseItem;
  onChange: (value: TaskBaseItem) => void;
}

const CustomScriptContent: FC<Props> = ({ value, onChange, mode }) => {
  const handleChange = (newValue: string) => {
    onChange({
      ...value,
      data: newValue,
    });
  };

  return <CustomScript value={value?.data} onChange={handleChange} mode={mode} />;
};

export default CustomScriptContent;
