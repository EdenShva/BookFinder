import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();
  const { colors } = useTheme();

  const renderBook = ({ item }) => {
    const info = item.volumeInfo;

    return (
      <View
        style={[
          styles.bookCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={styles.bookContent}
          onPress={() =>
            navigation.navigate("BookDetails", { book: item })
          }
        >
          {info.imageLinks?.thumbnail && (
            <Image
              source={{ uri: info.imageLinks.thumbnail }}
              style={styles.cover}
            />
          )}

          <View style={styles.bookInfo}>
            <Text
              style={[
                styles.bookTitle,
                { color: colors.text },
              ]}
            >
              {info.title}
            </Text>

            <Text
              style={[
                styles.author,
                { color: colors.secondaryText },
              ]}
            >
              {info.authors?.join(", ") || "Unknown author"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[
            styles.removeButton,
            { borderColor: colors.border },
          ]}
          onPress={() => removeFavorite(item.id)}
        >
          <Text
            style={[
              styles.removeText,
              { color: colors.text },
            ]}
          >
            Remove
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        My Favorites
      </Text>

      {favorites.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: colors.secondaryText },
          ]}
        >
          You don't have any favorite books yet.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  list: {
    paddingBottom: 20,
  },

  bookCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },

  bookContent: {
    flexDirection: "row",
  },

  cover: {
    width: 70,
    height: 105,
    borderRadius: 5,
  },

  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
  },

  author: {
    fontSize: 14,
  },

  removeButton: {
    marginTop: 10,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
  },

  removeText: {
    fontWeight: "bold",
  },
});