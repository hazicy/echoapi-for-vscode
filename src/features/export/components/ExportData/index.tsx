import React from 'react';
import { ExportDataWrap } from './style';
import Export from '@/features/export/components/Export';

const exportData = () => {
  
  return (
    <ExportDataWrap vertical>
      <Export />
    </ExportDataWrap>
  );
};
export default exportData;