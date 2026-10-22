import { theme } from '@/components/ui/base';

const { useToken } = theme;
const useTheme = (): { themeToken: Partial<GlobalThemeToken> } => {
  const { token } = useToken();
  return {
    themeToken: token,
  };
};

export default useTheme;
