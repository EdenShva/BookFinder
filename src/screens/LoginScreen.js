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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (!savedUser) {
        setMessage("No registered user found. Please register first.");
        return;
      }

      const user = JSON.parse(savedUser);

      const enteredEmail = email.trim().toLowerCase();

      if (
        enteredEmail !== user.email ||
        password !== user.password
      ) {
        setMessage("Incorrect email or password.");
        return;
      }

      setMessage("");

      await AsyncStorage.setItem("isLoggedIn", "true");

      navigation.replace("Main");
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookFinder</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

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
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>
          Don't have an account? Register
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

  registerText: {
    textAlign: "center",
    marginTop: 20,
  },
});