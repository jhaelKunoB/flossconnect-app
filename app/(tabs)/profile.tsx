import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePatientAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = usePatientAuth();

  const handleLogout = () => {
    const confirmLogout = async () => {
      try {
        await logout();
        router.replace("/");
      } catch (error) {
        console.error("Error cerrando sesión:", error);
        Alert.alert("Error", "No se pudo cerrar la sesión. Intenta nuevamente.");
      }
    };

    Alert.alert("Cerrar sesión", "¿Quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => void confirmLogout(),
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <ThemedText type="defaultSemiBold" style={styles.logoutText}>
          Cerrar sesión
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoutButton: {
    marginTop: 24,
    minWidth: 180,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B42318",
  },
  logoutText: {
    color: "#FFFFFF",
  },
});
