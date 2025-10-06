// src/contexts/ThemeContext.jsx
import React, { createContext, useContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // No DOM side-effects, always "light"
  const value = {
    theme: "light",
    toggleTheme: () => {}, // no-op
    setTheme: () => {}, // no-op
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // defensive: return default shape if accidentally used outside provider
    return {
      theme: "light",
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
};
