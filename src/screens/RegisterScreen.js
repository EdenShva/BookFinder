import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const USER_KEY = "registeredUser";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { colors } = useTheme();
  const { language } = useLanguage();

  const isHebrew = language === "he";

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
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

    if (password.length < 6) {
      setMessage(
        isHebrew
          ? "הסיסמה חייבת להכיל לפחות 6 תווים."
          : "Password must contain at least 6 characters."
      );
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
      setMessage(
        isHebrew
          ? "יצירת החשבון נכשלה."
          : "Failed to create account."
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              {isHebrew
                ? "יצירת חשבון"
                : "Create Account"}
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.secondaryText },
              ]}
            >
              {isHebrew
                ? "הצטרפי ל-BookFinder"
                : "Join BookFinder"}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                  textAlign: isHebrew
                    ? "right"
                    : "left",
                },
              ]}
              placeholder={isHebrew ? "שם" : "Name"}
              placeholderTextColor={
                colors.secondaryText
              }
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
              placeholder={
                isHebrew ? "אימייל" : "Email"
              }
              placeholderTextColor={
                colors.secondaryText
              }
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
                  textAlign: isHebrew
                    ? "right"
                    : "left",
                },
              ]}
              placeholder={
                isHebrew ? "סיסמה" : "Password"
              }
              placeholderTextColor={
                colors.secondaryText
              }
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
                {
                  backgroundColor: colors.button,
                },
              ]}
              onPress={handleRegister}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: colors.buttonText,
                  },
                ]}
              >
                {isHebrew ? "הרשמה" : "Register"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text
                style={[
                  styles.loginText,
                  { color: colors.text },
                ]}
              >
                {isHebrew
                  ? "כבר יש לך חשבון? התחברי"
                  : "Already have an account? Login"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
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