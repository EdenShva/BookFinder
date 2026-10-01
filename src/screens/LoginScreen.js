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
import { useLanguage } from "../context/LanguageContext";

const USER_KEY = "registeredUser";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { colors } = useTheme();
  const { language } = useLanguage();

  const isHebrew = language === "he";

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setMessage(
        isHebrew
          ? "יש להזין אימייל וסיסמה."
          : "Please enter email and password."
      );
      return;
    }

    try {
      const savedUser =
        await AsyncStorage.getItem(USER_KEY);

      if (!savedUser) {
        setMessage(
          isHebrew
            ? "לא נמצא משתמש רשום. יש להירשם תחילה."
            : "No registered user found. Please register first."
        );
        return;
      }

      const user = JSON.parse(savedUser);
      const enteredEmail = email.trim().toLowerCase();

      if (
        enteredEmail !== user.email ||
        password !== user.password
      ) {
        setMessage(
          isHebrew
            ? "האימייל או הסיסמה שגויים."
            : "Incorrect email or password."
        );
        return;
      }

      setMessage("");

      await AsyncStorage.setItem(
        "isLoggedIn",
        "true"
      );

      navigation.replace("Main");
    } catch (error) {
      setMessage(
        isHebrew
          ? "ההתחברות נכשלה. נסי שוב."
          : "Login failed. Please try again."
      );
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
        BookFinder
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        {isHebrew
          ? "התחברי לחשבון שלך"
          : "Login to your account"}
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
        placeholder={isHebrew ? "אימייל" : "Email"}
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
        placeholder={isHebrew ? "סיסמה" : "Password"}
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
        onPress={handleLogin}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}
        >
          {isHebrew ? "התחברות" : "Login"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          navigation.navigate("Register")
        }
      >
        <Text
          style={[
            styles.registerText,
            { color: colors.text },
          ]}
        >
          {isHebrew
            ? "אין לך חשבון? הירשמי"
            : "Don't have an account? Register"}
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

  registerText: {
    textAlign: "center",
    marginTop: 20,
  },
});