import { FC } from 'react';

import FolderParamsSettings from '@/features/collections/components/FolderSettings/ParamsSettings';
import { FolderComponentType } from '@/features/requests/types/folder';

import { ParamsContainer } from './style';

const Params: FC<FolderComponentType> = ({ apisData, onApisDataChange }) => {
  return (
    <ParamsContainer>
      <FolderParamsSettings value={apisData} onChange={onApisDataChange} />
    </ParamsContainer>
  );
};

export default Params;
