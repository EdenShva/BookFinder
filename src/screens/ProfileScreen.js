import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const USER_KEY = "registeredUser";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { darkMode, toggleTheme, colors } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const isHebrew = language === "he";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedUser =
        await AsyncStorage.getItem(USER_KEY);

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setName(user.name || "");
        setEmail(user.email || "");
        setPassword(user.password || "");
      }
    } catch (error) {
      setMessage(
        isHebrew
          ? "טעינת הפרופיל נכשלה."
          : "Failed to load profile."
      );
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage(
        isHebrew
          ? "יש למלא את כל השדות."
          : "Please fill in all fields."
      );
      return;
    }

    if (!email.includes("@")) {
      setMessage(
        isHebrew
          ? "יש להזין כתובת אימייל תקינה."
          : "Please enter a valid email."
      );
      return;
    }

    const updatedUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(updatedUser)
      );

      setEmail(updatedUser.email);

      setMessage(
        isHebrew
          ? "הפרופיל נשמר בהצלחה!"
          : "Profile saved successfully!"
      );
    } catch (error) {
      setMessage(
        isHebrew
          ? "שמירת הפרופיל נכשלה."
          : "Failed to save profile."
      );
    }
  };

  const handleDelete = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem("isLoggedIn");

      navigation.getParent()?.replace("Login");
    } catch (error) {
      setMessage(
        isHebrew
          ? "מחיקת הפרופיל נכשלה."
          : "Failed to delete profile."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");

      navigation.getParent()?.replace("Login");
    } catch (error) {
      setMessage(
        isHebrew
          ? "ההתנתקות נכשלה."
          : "Failed to logout."
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            textAlign: isHebrew ? "right" : "left",
          },
        ]}
      >
        {isHebrew ? "הפרופיל שלי" : "My Profile"}
      </Text>

      <View style={styles.themeRow}>
        <Text
          style={[
            styles.themeText,
            { color: colors.text },
          ]}
        >
          {isHebrew ? "מצב כהה" : "Dark Mode"}
        </Text>

        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {isHebrew ? "שפה" : "Language"}
      </Text>

      <View style={styles.languageContainer}>
        <Pressable
          style={[
            styles.languageButton,
            {
              borderColor: colors.border,
              backgroundColor:
                language === "en"
                  ? colors.button
                  : colors.card,
            },
          ]}
          onPress={() => changeLanguage("en")}
        >
          <Text
            style={{
              color:
                language === "en"
                  ? colors.buttonText
                  : colors.text,
              fontWeight: "bold",
            }}
          >
            English
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.languageButton,
            {
              borderColor: colors.border,
              backgroundColor:
                language === "he"
                  ? colors.button
                  : colors.card,
            },
          ]}
          onPress={() => changeLanguage("he")}
        >
          <Text
            style={{
              color:
                language === "he"
                  ? colors.buttonText
                  : colors.text,
              fontWeight: "bold",
            }}
          >
            עברית
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.label,
          {
            color: colors.text,
            textAlign: isHebrew ? "right" : "left",
          },
        ]}
      >
        {isHebrew ? "שם" : "Name"}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
            textAlign: isHebrew ? "right" : "left",
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder={isHebrew ? "שם" : "Name"}
        placeholderTextColor={colors.secondaryText}
      />

      <Text
        style={[
          styles.label,
          {
            color: colors.text,
            textAlign: isHebrew ? "right" : "left",
          },
        ]}
      >
        {isHebrew ? "אימייל" : "Email"}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder={isHebrew ? "אימייל" : "Email"}
        placeholderTextColor={colors.secondaryText}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.button },
        ]}
        onPress={handleSave}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}
        >
          {isHebrew
            ? "שמור פרופיל"
            : "Save Profile"}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.logoutButton,
          { borderColor: colors.border },
        ]}
        onPress={handleLogout}
      >
        <Text
          style={[
            styles.logoutText,
            { color: colors.text },
          ]}
        >
          {isHebrew ? "התנתק" : "Logout"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteText}>
          {isHebrew
            ? "מחק פרופיל"
            : "Delete Profile"}
        </Text>
      </Pressable>

      {message !== "" && (
        <Text
          style={[
            styles.message,
            message.includes("successfully") ||
            message.includes("בהצלחה")
              ? styles.success
              : styles.error,
          ]}
        >
          {message}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  themeText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  languageContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },

  languageButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
  },

  logoutButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 12,
  },

  logoutText: {
    fontWeight: "bold",
  },

  deleteButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  deleteText: {
    color: "#b00020",
    fontWeight: "bold",
  },

  message: {
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
  },

  success: {
    color: "green",
  },

  error: {
    color: "#b00020",
  },
});