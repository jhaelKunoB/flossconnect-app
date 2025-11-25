import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';


function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded || isLoggedIn === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: "Inicio" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
  
  );
}
