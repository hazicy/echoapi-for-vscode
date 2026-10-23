import IconFont from '@/shared/ui/IconFont';
import useTheme from '@/shared/hooks/useTheme';

import { ArrowWrapper } from './style';

const Arrow = ({ activeKey, show }: { activeKey: string | undefined; show: boolean }) => {
  const { themeToken } = useTheme();
  return (
    <ArrowWrapper>
      {show && (
        <IconFont
          style={{ fontSize: themeToken.fontSize, color: themeToken.iconColor }}
          type="icon-arrow-down"
          rotate={activeKey ? 0 : -90}
        />
      )}
    </ArrowWrapper>
  );
};

export default Arrow;
