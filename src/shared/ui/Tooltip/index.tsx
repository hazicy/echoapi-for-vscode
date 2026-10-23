import { FC } from 'react';

import { Tooltip as AntdTooltip, TooltipProps } from '@/shared/ui/base';

type Props = TooltipProps;

const Tooltip: FC<Props> = (props) => {
  return <AntdTooltip {...props} />;
};

Tooltip.defaultProps = {
  mouseEnterDelay: 0.5,
};

export default Tooltip;
