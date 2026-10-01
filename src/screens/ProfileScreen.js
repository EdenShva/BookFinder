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

const USER_KEY = "registeredUser";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { darkMode, toggleTheme, colors } = useTheme();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setName(user.name || "");
        setEmail(user.email || "");
        setPassword(user.password || "");
      }
    } catch (error) {
      setMessage("Failed to load profile.");
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
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
      setMessage("Profile saved successfully!");
    } catch (error) {
      setMessage("Failed to save profile.");
    }
  };

  const handleDelete = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem("isLoggedIn");

      navigation.getParent()?.replace("Login");
    } catch (error) {
      setMessage("Failed to delete profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");

      navigation.getParent()?.replace("Login");
    } catch (error) {
      setMessage("Failed to logout.");
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
          { color: colors.text },
        ]}
      >
        My Profile
      </Text>

      <View style={styles.themeRow}>
        <Text
          style={[
            styles.themeText,
            { color: colors.text },
          ]}
        >
          Dark Mode
        </Text>

        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
        />
      </View>

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Name
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
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={colors.secondaryText}
      />

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Email
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
        placeholder="Email"
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
          Save Profile
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
          Logout
        </Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteText}>
          Delete Profile
        </Text>
      </Pressable>

      {message !== "" && (
        <Text
          style={[
            styles.message,
            message.includes("successfully")
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