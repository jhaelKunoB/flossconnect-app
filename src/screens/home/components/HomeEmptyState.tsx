import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];

  title: string;

  description: string;

  action?: string;

  onPress?: () => void;
};

export function HomeEmptyState({ icon, title, description, action, onPress }: Props) {
  const c = useSemanticColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.surface,

          borderColor: c.border,
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
        <Ionicons name={icon} size={18} color={c.primary} />
      </View>

      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>

        <ThemedText
          type="default"
          style={[
            styles.description,
            {
              color: c.textSecondary,
            },
          ]}
        >
          {description}
        </ThemedText>
      </View>

      {action && onPress && (
        <Pressable onPress={onPress} hitSlop={8}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.action,
              {
                color: c.primary,
              },
            ]}
          >
            {action}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 74,

    borderWidth: 1,

    borderRadius: 16,

    paddingHorizontal: 12,

    paddingVertical: 11,

    flexDirection: "row",

    alignItems: "center",
  },

  icon: {
    width: 38,

    height: 38,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,
  },

  content: {
    flex: 1,

    paddingRight: 8,
  },

  title: {
    fontSize: 12,

    fontWeight: "700",
  },

  description: {
    marginTop: 2,

    fontSize: 9,

    lineHeight: 14,
  },

  action: {
    fontSize: 10,

    fontWeight: "700",
  },
});
