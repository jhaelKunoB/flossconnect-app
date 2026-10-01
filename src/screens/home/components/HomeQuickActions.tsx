import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

type Action = {
  icon: React.ComponentProps<typeof Ionicons>["name"];

  label: string;

  onPress: () => void;
};

type Props = {
  actions: Action[];
};

export function HomeQuickActions({ actions }: Props) {
  const c = useSemanticColors();

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <Pressable
          key={`${action.label}-${index}`}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.item,

            {
              backgroundColor: c.surface,

              borderColor: c.border,

              opacity: pressed ? 0.72 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.icon,
              {
                backgroundColor: c.surfaceAlt,
              },
            ]}
          >
            <Ionicons name={action.icon} size={18} color={c.primary} />
          </View>

          <ThemedText type="defaultSemiBold" style={styles.label} numberOfLines={1}>
            {action.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    gap: 8,

    marginBottom: 22,
  },

  item: {
    flex: 1,

    minHeight: 76,

    borderWidth: 1,

    borderRadius: 15,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 5,

    paddingVertical: 9,
  },

  icon: {
    width: 34,

    height: 34,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 6,
  },

  label: {
    fontSize: 9,

    fontWeight: "700",
  },
});
