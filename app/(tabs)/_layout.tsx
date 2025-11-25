import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSemanticColors } from "@/hooks/useSemanticColors";

export default function TabLayout() {
  const c = useSemanticColors();
  const insets = useSafeAreaInsets();

  const ICON_SIZE = 26;
  const baseHeight = Platform.OS === "ios" ? 60 : 64;
  const bottomPad = Math.max(10, (Platform.OS === "ios" ? 12 : 8) + (insets.bottom > 0 ? 6 : 0));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFFFFF", // Blanco cuando activo
        tabBarInactiveTintColor: "#9CA3AF", // Gris claro cuando inactivo

        tabBarStyle: {
          backgroundColor: '#151c25ff', // ← FONDO OSCURO DEL TABBAR
          height: baseHeight + (insets.bottom > 0 ? 6 : 0),
          paddingTop: 8,
          paddingBottom: bottomPad,

          // Estilo "flotante"
          marginHorizontal: 16,
          marginBottom: Platform.OS === "ios" ? Math.max(10, insets.bottom) : 10,
          borderRadius: 50,
          overflow: "hidden",

          // Sin borde
          borderTopWidth: 0,

          // Sombra más pronunciada para fondo oscuro
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        },

        tabBarItemStyle: {
          paddingVertical: Platform.select({ ios: 6, android: 4 }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name="house.fill" 
              size={ICON_SIZE} 
              color={focused ? "#FFFFFF" : "#9CA3AF"} 
            />
          ),
          tabBarAccessibilityLabel: "Inicio",
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name="calendar" 
              size={ICON_SIZE} 
              color={focused ? "#FFFFFF" : "#9CA3AF"} 
            />
          ),
          tabBarAccessibilityLabel: "Agenda",
        }}
      />

      <Tabs.Screen
        name="TreatmentScreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name="treatment" 
              size={ICON_SIZE} 
              color={focused ? "#FFFFFF" : "#9CA3AF"} 
            />
          ),
          tabBarAccessibilityLabel: "Tratamiento",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              name="person" 
              size={ICON_SIZE} 
              color={focused ? "#FFFFFF" : "#9CA3AF"} 
            />
          ),
          tabBarAccessibilityLabel: "Perfil",
        }}
      />
    </Tabs>
  );
}