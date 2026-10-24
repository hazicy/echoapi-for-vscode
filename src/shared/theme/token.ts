export const generateToken = (antdThemeConfig: {
  token: Partial<GlobalThemeToken>;
}) => ({
  padding: 16,
  paddingMD: 20,
  paddingSM: 12,
  paddingXS: 8,
  margin: 16,
  marginMD: 20,
  marginSM: 12,
  marginXS: 8,
  controlHeight: 32,
  controlHeightSM: 24,
  controlHeightLG: 40,
  ...antdThemeConfig.token,
  // Partial overrides
  colorText: antdThemeConfig.token.fontContentColor,
  colorBgElevated: antdThemeConfig.token.colorBgRight,
  colorBorderSecondary: antdThemeConfig.token.colorBorder,
  colorSplit: antdThemeConfig.token.colorBorder,
  colorTextHeading: antdThemeConfig.token.fontTitleColor,
  fontSizeHeading3: (antdThemeConfig.token.fontSize || 12) * (3 / 2),
  colorLink: antdThemeConfig.token.colorPrimary,
  colorTextQuaternary: antdThemeConfig.token.fontLightColor,
});
