import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "registeredUser";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join BookFinder</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
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
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>
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
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginText: {
    textAlign: "center",
    marginTop: 20,
  },
});