import { FC, useMemo } from 'react';

import { isArray, isPlainObject, keys, size } from 'lodash';

import { TabsHeaderCountContainer, TabsHeaderDotContainer } from './style';
import slots from '@/shared/ui/base/slots.module.css';

interface Props {
  dataSource?: any;
  showDot?: boolean;
  customCalcFun?: (dataSource: any) => number;
  label: any;
}

const HeaderCount: FC<Props> = ({ label, dataSource, showDot = false, customCalcFun }) => {
  const calcCount = useMemo(() => {
    if (showDot) return 0;

    if (customCalcFun) {
      return customCalcFun(dataSource);
    }

    if (isPlainObject(dataSource)) {
      const number = size(keys(dataSource));
      return number;
    }

    if (isArray(dataSource)) {
      return size(dataSource);
    }
  }, [dataSource, customCalcFun, showDot]);

  if (showDot) {
    return <TabsHeaderCountContainer>
      {label}
      <TabsHeaderDotContainer />
    </TabsHeaderCountContainer>;
  }

  return <TabsHeaderCountContainer>
    {label}
    {!!calcCount && calcCount > 0 && <span className={slots['tabs-count-badge']}>{calcCount}</span>}
  </TabsHeaderCountContainer>;
};

export default HeaderCount;
