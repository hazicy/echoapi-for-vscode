import { FC } from 'react';

import FolderBaseSettings from '@/features/collections/components/FolderSettings/BaseSettings';
import { FolderComponentType } from '@/features/requests/types/folder';

import { SettingsContainer } from './style';

const Settings: FC<FolderComponentType> = ({ apisData, onApisDataChange }) => {
  return (
    <SettingsContainer>
      <FolderBaseSettings value={apisData} onChange={onApisDataChange} />
    </SettingsContainer>
  );
};

export default Settings;
