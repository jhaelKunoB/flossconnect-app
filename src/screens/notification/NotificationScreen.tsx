import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSemanticColors } from "@/hooks/useSemanticColors";

const notifications = [
  {
    id: "1",
    title: "Sin notificaciones",
    message: "Aquí aparecerán tus avisos importantes.",
    icon: "notifications-outline" as const,
  },
];

export default function NotificationScreen() {
  const router = useRouter();
  const colors = useSemanticColors();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.title}>
          Notificaciones
        </ThemedText>

        <View style={styles.headerSpace} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>

            <View style={styles.content}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={[styles.message, { color: colors.textSecondary }]}>
                {item.message}
              </ThemedText>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
  },
  headerSpace: {
    width: 24,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    fontSize: 13,
    marginTop: 4,
  },
});