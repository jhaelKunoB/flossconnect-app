import { Platform } from "react-native";

import { Redirect, Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { usePatientAuth } from "@/hooks/useAuth";

/* ========================================================================== */
/*                                  LAYOUT                                    */
/* ========================================================================== */

export default function TabLayout() {
  const { initializing, isLoggedIn } = usePatientAuth();
  const insets = useSafeAreaInsets();

  if (initializing) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(Auth)/LoginScreen" />;
  }

  const activeColor = "#FFFFFF";

  const inactiveColor = "#7F8A99";

  const tabBackground = "#151C25";

  const bottomPadding = Platform.OS === "ios" ? Math.max(8, insets.bottom > 0 ? 8 : 10) : 8;

  const tabHeight = Platform.OS === "ios" ? 70 : 68;

  return (
    <Tabs
      screenOptions={{
        /* ================================================================== */
        /* GENERAL                                                            */
        /* ================================================================== */

        headerShown: false,

        tabBarButton: HapticTab,

        tabBarActiveTintColor: activeColor,

        tabBarInactiveTintColor: inactiveColor,

        tabBarHideOnKeyboard: true,

        /* ================================================================== */
        /* LABEL                                                              */
        /* ================================================================== */

        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 9,

          fontWeight: "600",

          marginTop: 2,
        },

        /* ================================================================== */
        /* TAB BAR                                                            */
        /* ================================================================== */

        tabBarStyle: {
          position: "absolute",

          backgroundColor: tabBackground,

          height: tabHeight + (insets.bottom > 0 ? 6 : 0),

          paddingTop: 8,

          paddingBottom: bottomPadding,

          /* -------------------------------------------------------------- */
          /* FLOATING                                                       */
          /* -------------------------------------------------------------- */

          marginHorizontal: 14,

          marginBottom: Platform.OS === "ios" ? Math.max(10, insets.bottom) : 10,

          borderRadius: 28,

          /* -------------------------------------------------------------- */
          /* REMOVE DEFAULT BORDER                                          */
          /* -------------------------------------------------------------- */

          borderTopWidth: 0,

          /* -------------------------------------------------------------- */
          /* SHADOW                                                         */
          /* -------------------------------------------------------------- */

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,

            height: 6,
          },

          shadowOpacity: 0.24,

          shadowRadius: 12,

          elevation: 14,
        },

        /* ================================================================== */
        /* ITEM                                                               */
        /* ================================================================== */

        tabBarItemStyle: {
          paddingVertical: Platform.select({
            ios: 4,

            android: 3,
          }),
        },
      }}
    >
      {/* ================================================================== */}
      {/* HOME                                                               */}
      {/* ================================================================== */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",

          tabBarAccessibilityLabel: "Inicio",

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={23} color={color} />,
        }}
      />

      {/* ================================================================== */}
      {/* APPOINTMENTS                                                       */}
      {/* ================================================================== */}

      <Tabs.Screen
        name="appointments"
        options={{
          title: "Citas",

          tabBarAccessibilityLabel: "Mis citas",

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "calendar" : "calendar-outline"} size={23} color={color} />,
        }}
      />

      {/* ================================================================== */}
      {/* HEALTH                                                             */}
      {/* ================================================================== */}

      <Tabs.Screen
        name="health"
        options={{
          title: "Mi salud",

          tabBarAccessibilityLabel: "Mi salud",

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "heart" : "heart-outline"} size={23} color={color} />,
        }}
      />

      {/* ================================================================== */}
      {/* PROMOTIONS                                                         */}
      {/* ================================================================== */}

      <Tabs.Screen
        name="promotions"
        options={{
          title: "Promos",

          tabBarAccessibilityLabel: "Promociones",

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={23} color={color} />,
        }}
      />

      {/* ================================================================== */}
      {/* PROFILE                                                            */}
      {/* ================================================================== */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",

          tabBarAccessibilityLabel: "Perfil",

          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={23} color={color} />,
        }}
      />
    </Tabs>
  );
}
