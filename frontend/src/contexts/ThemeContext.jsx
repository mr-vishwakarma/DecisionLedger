import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme-mode') || 'light');
  const [color, setColor] = useState(() => localStorage.getItem('theme-color') || 'default');

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old classes
    root.classList.remove('light', 'dark', 'theme-default', 'theme-green', 'theme-red', 'theme-brown', 'theme-violet');

    // Add new classes
    root.classList.add(mode);
    root.classList.add(`theme-${color}`);

    // Persist to local storage
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-color', color);
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
