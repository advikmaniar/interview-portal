import React, { createContext, useState, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeModeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark"); // default theme

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#6200ea",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
    },
  });

  const toggleTheme = () => {
    setMode(prevMode => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      console.log("Toggling theme to:", newMode); // Debug line to check mode
      return newMode;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
