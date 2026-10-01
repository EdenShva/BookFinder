import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext();

const LANGUAGE_KEY = "appLanguage";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage =
        await AsyncStorage.getItem(LANGUAGE_KEY);

      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.log("Failed to load language:", error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);

    try {
      await AsyncStorage.setItem(
        LANGUAGE_KEY,
        newLanguage
      );
    } catch (error) {
      console.log("Failed to save language:", error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}