import React from "react";
import { ThemeProvider, useThemeConfig } from "./theme";
import type { ThemeConfig } from "./theme";
import type { UIProps } from "./types";
export * from "./types";
export * from "./controls";
export * from "./select";
export * from "./layout";
export * from "./popups";
export * from "./form";
export * from "./data";
export * from "./feedback";
export { theme, ThemeProvider } from "./theme";
export { Drawer } from "../Drawer";
export function ConfigProvider({
  theme = {},
  children,
}: UIProps & { theme?: ThemeConfig }) {
  const parent = useThemeConfig();
  return (
    <ThemeProvider
      theme={{
        ...parent,
        ...theme,
        token: { ...parent.token, ...theme.token },
      }}
    >
      {children}
    </ThemeProvider>
  );
}
