import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "registeredUser";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
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
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.label}>Name</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Profile</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  logoutButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
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
    color: "red",
  },
});