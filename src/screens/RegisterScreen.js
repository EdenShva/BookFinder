import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const USER_KEY = "registeredUser";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );

      setMessage("");

      navigation.replace("Login");
    } catch (error) {
      setMessage("Failed to create account.");
    }
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
        Create Account
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        Join BookFinder
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
        placeholder="Name"
        placeholderTextColor={colors.secondaryText}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.secondaryText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.secondaryText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {message !== "" && (
        <Text style={styles.errorMessage}>
          {message}
        </Text>
      )}

      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.button },
        ]}
        onPress={handleRegister}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}
        >
          Register
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={[
            styles.loginText,
            { color: colors.text },
          ]}
        >
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },

  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  loginText: {
    textAlign: "center",
    marginTop: 20,
  },
});