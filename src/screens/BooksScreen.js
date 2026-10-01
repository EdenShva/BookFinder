import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { searchBooks } from "../api/booksApi";

export default function BooksScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);

    const results = await searchBooks(query);

    setBooks(results);
    setLoading(false);
  };

  const renderBook = ({ item }) => {
    const info = item.volumeInfo;

    return (
      <Pressable
        style={styles.bookCard}
        onPress={() => {
          console.log("BOOK CLICKED:", info.title);

          navigation.navigate("BookDetails", {
            book: item,
          });
        }}
      >
        {info.imageLinks?.thumbnail && (
          <Image
            source={{ uri: info.imageLinks.thumbnail }}
            style={styles.cover}
          />
        )}

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>
            {info.title}
          </Text>

          <Text style={styles.author}>
            {info.authors?.join(", ") || "Unknown author"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Book</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by title or author..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />

        <Pressable
          style={styles.button}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={books}
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

  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
  },

  button: {
    backgroundColor: "#333",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  loader: {
    marginTop: 40,
  },

  list: {
    paddingBottom: 20,
  },

  bookCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    cursor: "pointer",
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
});