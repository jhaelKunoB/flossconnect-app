// components/HeaderGreeting.tsx
import React, { useMemo } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSemanticColors } from "@/hooks/useSemanticColors";
import Ionicons from "@expo/vector-icons/Ionicons"; // si quieres, luego lo cambias a Lineicons

type Props = {
  avatar: ImageSourcePropType | { uri: string };
  name: string;
  onPressBell?: () => void;
  style?: ViewStyle;
  badgeCount?: number;
  greetingIcon?: React.ReactNode; // <-- NUEVO
};

function getGreeting(): "Buenos días" | "Buenas tardes" | "Buenas noches" {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const AVATAR = 42;

const HeaderGreeting: React.FC<Props> = ({
  avatar,
  name,
  onPressBell,
  style,
  badgeCount = 0,
  greetingIcon, // <-- NUEVO
}) => {
  const c = useSemanticColors();
  const greeting = useMemo(getGreeting, []);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: c.surface }]}>
      <View style={[styles.container, style]}>
        {/* Left: Avatar + (greeting + name) */}
        <View style={styles.left}>
          <Image
            source={avatar as any}
            style={[styles.avatar, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}
          />
          <View style={styles.texts}>
            <View style={styles.greetingRow}>
              {/* Fallback 👋 si no pasas greetingIcon */}
              {greetingIcon ?? <Text style={styles.handEmoji}>👋</Text>}
              <Text style={[styles.greeting, { color: c.textSecondary }]} numberOfLines={1}>
                {greeting}
              </Text>
            </View>
            <Text style={[styles.name, { color: c.textPrimary }]} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        {/* Right: Bell */}
        <TouchableOpacity
          onPress={onPressBell}
          style={styles.bellBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Notificaciones"
        >
          <Ionicons name="notifications-outline" size={22} color={c.textPrimary} />
          {badgeCount > 0 && (
            <View style={[styles.badge, { backgroundColor: c.primary }]}>
              <Text style={styles.badgeTxt}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { width: "100%" },
  container: {
    height: 74,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 1,
    marginRight: 12,
  },
  texts: { flex: 1, minWidth: 0 },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  handEmoji: { fontSize: 14, marginTop: 1 },
  greeting: { fontSize: 12, fontWeight: "600", opacity: 0.9 },
  name: { fontSize: 18, fontWeight: "800", marginTop: 2 },
  bellBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
});

export default HeaderGreeting;
