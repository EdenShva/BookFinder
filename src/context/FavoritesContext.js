import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

const FAVORITES_KEY = "favoriteBooks";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites =
        await AsyncStorage.getItem(FAVORITES_KEY);

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.log("Failed to load favorites:", error);
    }
  };

  const addFavorite = async (book) => {
    try {
      const alreadyExists = favorites.some(
        (favorite) => favorite.id === book.id
      );

      if (alreadyExists) {
        return;
      }

      const updatedFavorites = [...favorites, book];

      setFavorites(updatedFavorites);

      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.log("Failed to add favorite:", error);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      const updatedFavorites = favorites.filter(
        (book) => book.id !== bookId
      );

      setFavorites(updatedFavorites);

      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.log("Failed to remove favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}