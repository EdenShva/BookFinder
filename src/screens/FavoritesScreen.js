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

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();

  const renderBook = ({ item }) => {
    const info = item.volumeInfo;

    return (
      <View style={styles.bookCard}>
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
            <Text style={styles.bookTitle}>{info.title}</Text>

            <Text style={styles.author}>
              {info.authors?.join(", ") || "Unknown author"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>
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
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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
    borderColor: "#333",
    borderRadius: 6,
  },

  removeText: {
    fontWeight: "bold",
  },
});