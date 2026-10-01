import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import BookDetailsScreen from "./src/screens/BookDetailsScreen";
import MainTabs from "./src/navigation/MainTabs";
import { FavoritesProvider } from "./src/context/FavoritesContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");

      setIsLoggedIn(loginStatus === "true");
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Main" : "Login"}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Register" }}
          />

          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{ title: "Book Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}