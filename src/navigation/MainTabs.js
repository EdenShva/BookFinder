import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BooksScreen from "../screens/BooksScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { darkMode, colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },

        headerTintColor: colors.text,

        headerTitleStyle: {
          color: colors.text,
        },

        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },

        tabBarActiveTintColor: darkMode
          ? "#ffffff"
          : "#111111",

        tabBarInactiveTintColor: colors.secondaryText,
      }}
    >
      <Tab.Screen
        name="Books"
        component={BooksScreen}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}