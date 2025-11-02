import React, { useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import { lightTheme, darkTheme } from '@/theme/theme';
import { getStorageData } from '@/lib/storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export default function App({ Component, pageProps }: AppProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme preference from storage
    const storage = getStorageData();
    setThemeMode(storage.theme);
    setMounted(true);
  }, []);

  // Listen for storage changes (theme updates)
  useEffect(() => {
    if (!mounted) return;
    
    const handleStorageChange = () => {
      const storage = getStorageData();
      setThemeMode(storage.theme);
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window updates
    const handleCustomStorage = () => {
      const storage = getStorageData();
      setThemeMode(storage.theme);
    };
    
    window.addEventListener('themeChanged', handleCustomStorage as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleCustomStorage as EventListener);
    };
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
