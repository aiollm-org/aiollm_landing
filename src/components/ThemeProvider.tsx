'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { themeCookieName, type ThemeMode } from '@/lib/theme';

const ThemeContext = createContext<{
  theme: ThemeMode;
  selectTheme: (theme: ThemeMode) => void;
} | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeMode;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState(initialTheme);

  function selectTheme(next: ThemeMode) {
    document.documentElement.dataset.theme = next;
    document.cookie = `${themeCookieName}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    setTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
