import React from "react";
import {
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import * as Speech from "expo-speech";

import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function BookDetailsScreen({ route }) {
  const { book } = route.params;
  const info = book.volumeInfo;

  const {
    favorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();

  const { colors } = useTheme();
  const { language } = useLanguage();

  const isHebrew = language === "he";

  const isFavorite = favorites.some(
    (favorite) => favorite.id === book.id
  );

  const description =
    info.description ||
    (isHebrew
      ? "אין תיאור זמין."
      : "No description available.");

  const handleReadDescription = () => {
    Speech.stop();

    Speech.speak(description, {
      language: "en-US",
      rate: 0.9,
      pitch: 1.0,
    });
  };

  const handleStopReading = () => {
    Speech.stop();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {info.imageLinks?.thumbnail && (
        <Image
          source={{ uri: info.imageLinks.thumbnail }}
          style={styles.cover}
        />
      )}

      <Text
        style={[
          styles.title,
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
        {info.authors?.join(", ") ||
          (isHebrew ? "מחבר לא ידוע" : "Unknown author")}
      </Text>

      {info.publishedDate && (
        <Text
          style={[
            styles.detail,
            { color: colors.secondaryText },
          ]}
        >
          {isHebrew ? "פורסם:" : "Published:"}{" "}
          {info.publishedDate}
        </Text>
      )}

      {info.pageCount && (
        <Text
          style={[
            styles.detail,
            { color: colors.secondaryText },
          ]}
        >
          {isHebrew ? "עמודים:" : "Pages:"}{" "}
          {info.pageCount}
        </Text>
      )}

      <Text
        style={[
          styles.description,
          { color: colors.text },
        ]}
      >
        {description}
      </Text>

      <View style={styles.speechButtons}>
        <Pressable
          style={[
            styles.speechButton,
            { borderColor: colors.border },
          ]}
          onPress={handleReadDescription}
        >
          <Text
            style={[
              styles.speechButtonText,
              { color: colors.text },
            ]}
          >
            {isHebrew
              ? "🔊 הקרא תיאור"
              : "🔊 Read Description"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.stopButton}
          onPress={handleStopReading}
        >
          <Text style={styles.stopButtonText}>
            {isHebrew
              ? "עצור הקראה"
              : "Stop Reading"}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.button },
        ]}
        onPress={() =>
          isFavorite
            ? removeFavorite(book.id)
            : addFavorite(book)
        }
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}
        >
          {isFavorite
            ? isHebrew
              ? "הסר מהמועדפים"
              : "Remove from Favorites"
            : isHebrew
              ? "הוסף למועדפים"
              : "Add to Favorites"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },

  cover: {
    width: 140,
    height: 210,
    marginBottom: 20,
    borderRadius: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  author: {
    fontSize: 17,
    marginBottom: 20,
  },

  detail: {
    fontSize: 15,
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 20,
  },

  speechButtons: {
    width: "100%",
    marginBottom: 15,
  },

  speechButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  speechButtonText: {
    fontWeight: "bold",
  },

  stopButton: {
    paddingVertical: 10,
    alignItems: "center",
  },

  stopButtonText: {
    fontWeight: "bold",
    color: "#b00020",
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  buttonText: {
    fontWeight: "bold",
  },
});