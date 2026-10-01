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
  RefreshControl,
} from "react-native";

import { searchBooks } from "../api/booksApi";

export default function BooksScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);

    const results = await searchBooks(query);

    setBooks(results);
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!query.trim()) {
      return;
    }

    setRefreshing(true);

    const results = await searchBooks(query);

    setBooks(results);

    setRefreshing(false);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.volumeInfo.title || "";
    const authors = book.volumeInfo.authors?.join(" ") || "";

    const filterText = filter.toLowerCase();

    return (
      title.toLowerCase().includes(filterText) ||
      authors.toLowerCase().includes(filterText)
    );
  });

  const renderBook = ({ item }) => {
    const info = item.volumeInfo;

    return (
      <Pressable
        style={styles.bookCard}
        onPress={() =>
          navigation.navigate("BookDetails", {
            book: item,
          })
        }
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
          placeholder="Search Google Books..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />

        <Pressable
          style={styles.button}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>
            Search
          </Text>
        </Pressable>
      </View>

      {books.length > 0 && (
        <TextInput
          style={styles.filterInput}
          placeholder="Filter results by title or author..."
          value={filter}
          onChangeText={setFilter}
        />
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            books.length > 0 && filter !== "" ? (
              <Text style={styles.emptyText}>
                No books match this filter.
              </Text>
            ) : null
          }
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
    marginBottom: 12,
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

  filterInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  loader: {
    marginTop: 40,
  },

  list: {
    paddingBottom: 20,
    flexGrow: 1,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },

  bookCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
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