import { useState } from 'react';
import { Button, Input, Select } from '@/shared/ui/base';
import { ThemeProvider } from '@/shared/ui/base/Theme';
import GlobalThemeStyle from '@/shared/theme/global';
import { DeleteContainer } from '@/features/environment/components/Environment/components/EnvManage/components/EnvServers/components/ItemMenu/style';
export default function ThemeFixture() {
  const [dark, setDark] = useState(false);
  return (
    <ThemeProvider theme={{ token: {
      colorPrimary: dark ? '#ff0000' : '#1677ff',
      fontSize: dark ? 14 : 12,
      fontSize14: dark ? 16 : 14,
      borderRadius: dark ? 6 : 4,
    } }}>
      <GlobalThemeStyle />
      <Button>Theme button</Button>
      <Input aria-label="Theme input" />
      <Select aria-label="Theme select" options={[]} />
      <button onClick={() => setDark((value) => !value)}>Toggle theme</button>
      <DeleteContainer $disable={!dark} style={{ color: 'var(--color-primary)' }}>
        Styled state
      </DeleteContainer>
    </ThemeProvider>
  );
}
