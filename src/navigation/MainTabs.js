import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BooksScreen from "../screens/BooksScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Tab = createBottomTabNavigator();

export default function MainTabs({ onLogout }) {
  const { darkMode, colors } = useTheme();
  const { language } = useLanguage();

  const isHebrew = language === "he";

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
        options={{
          title: isHebrew ? "ספרים" : "Books",
          tabBarLabel: isHebrew ? "ספרים" : "Books",
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: isHebrew ? "מועדפים" : "Favorites",
          tabBarLabel: isHebrew ? "מועדפים" : "Favorites",
        }}
      />

      <Tab.Screen
        name="Profile"
        options={{
          title: isHebrew ? "פרופיל" : "Profile",
          tabBarLabel: isHebrew ? "פרופיל" : "Profile",
        }}
      >
        {(props) => (
          <ProfileScreen
            {...props}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}