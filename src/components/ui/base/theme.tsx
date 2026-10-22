import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

export interface ThemeConfig {
  token?: Partial<GlobalThemeToken>;
  components?: Record<string, Record<string, unknown>>;
  cssVar?: boolean;
  hash?: boolean;
}
const ThemeContext = createContext<ThemeConfig>({ token: {} });
export function ThemeProvider({
  theme,
  children,
}: PropsWithChildren<{ theme: ThemeConfig }>) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
export const useThemeConfig = () => useContext(ThemeContext);
export const theme = {
  useToken: () => ({ token: useThemeConfig().token ?? {} }),
};
