import { saveProjectConfig } from '@/events/apis/env';
import { FC } from 'react';
import { Flex, MenuProps } from '@/components/ui/base';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import TitleEdit from '@/components/ui/TitleEdit';
import EnvDropdown from '@/components/business/EnvDropdown';
import { useProjectConfig } from '@/store';
import { ApiDetailsData } from '@/types/apis/api';
import { ChangeFuncType } from '@/types/common';
import { ToolBarContainer } from './style';
interface Props {
  apisData: ApiDetailsData;
  onApisDataChange: (data: ApiDetailsData) => void;
}
const ToolBar: FC<Props> = ({ apisData, onApisDataChange }) => {
  const envDetailKeys = useProjectConfig((state) => state.envDetailKeys);
  const updateEnvDetailKeys = useProjectConfig((state) => state.updateEnvDetailKeys);
  const handleChange: ChangeFuncType<ApiDetailsData> = useMemoizedFn((field, value) => {
    const newData = produce(apisData, (draft) => {
      draft[field] = value;
    });

    onApisDataChange(newData);
  });

  const envClick: MenuProps['onClick'] = ({ key }) => {
    // Switch environment
    updateEnvDetailKeys(key);
    saveProjectConfig('envDetailKeys', key);
  };

  return (
    <ToolBarContainer>
      <Flex gap={4} className="tab-bar-extra-content-wrap" align="center" justify="space-between">
        
        <Flex gap={8} align="center" className="edit-wrap" flex={1}>
          <TitleEdit
            maxLength={255}
            className="apis-title-edit"
            value={apisData?.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </Flex>
         <Flex style={{ height: 26 }}>
          <EnvDropdown isApis value={envDetailKeys} onEnvClick={envClick} />
        </Flex>
      </Flex>
    </ToolBarContainer>
  );
};

export default ToolBar;
