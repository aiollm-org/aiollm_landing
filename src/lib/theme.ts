export const themeCookieName = 'aiollm-theme';
export const themeModes = ['system', 'dark', 'light'] as const;
export type ThemeMode = (typeof themeModes)[number];

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return themeModes.some((theme) => theme === value);
}

export function parseTheme(value: string | undefined): ThemeMode {
  return isThemeMode(value) ? value : 'system';
}
