import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (book) => {
    setFavorites((currentFavorites) => {
      const alreadyExists = currentFavorites.some(
        (favorite) => favorite.id === book.id
      );

      if (alreadyExists) {
        return currentFavorites;
      }

      return [...currentFavorites, book];
    });
  };

  const removeFavorite = (bookId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((book) => book.id !== bookId)
    );
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