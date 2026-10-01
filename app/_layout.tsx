import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { PatientAuthProvider, usePatientAuth } from "@/hooks/useAuth";

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { initializing } = usePatientAuth();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || initializing) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: "Inicio" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="(Appointment)/form_appointment" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="(Notifications)/notifications" options={{ presentation: "modal", headerShown: false, title: "Notificaciones" }} />


        <Stack.Screen name="(Auth)/LoginScreen" options={{ headerShown: false, title: "Iniciar sesión" }} />
        <Stack.Screen name="(Auth)/RegisterScreen" options={{ headerShown: false, title: "Registro" }} />
        <Stack.Screen name="(Auth)/ForgotPassword" options={{ headerShown: false, title: "Recuperar contraseña" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PatientAuthProvider>
      <RootLayoutInner />
    </PatientAuthProvider>
  );
}
