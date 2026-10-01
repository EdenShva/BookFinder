import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

const THEME_KEY = "appTheme";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);

      if (savedTheme !== null) {
        setDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Failed to load theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    try {
      await AsyncStorage.setItem(
        THEME_KEY,
        newDarkMode ? "dark" : "light"
      );
    } catch (error) {
      console.log("Failed to save theme:", error);
    }
  };

  const colors = darkMode
    ? {
        background: "#121212",
        card: "#1e1e1e",
        text: "#ffffff",
        secondaryText: "#bdbdbd",
        border: "#444444",
        button: "#ffffff",
        buttonText: "#121212",
      }
    : {
        background: "#f5f5f5",
        card: "#ffffff",
        text: "#111111",
        secondaryText: "#555555",
        border: "#dddddd",
        button: "#333333",
        buttonText: "#ffffff",
      };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}