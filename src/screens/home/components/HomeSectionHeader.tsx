// components/HomeSectionHeader.tsx

import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

/* ========================================================================== */
/*                                   PROPS                                    */
/* ========================================================================== */

type Props = {
  title: string;

  action?: string;

  onPress?: () => void;
};

/* ========================================================================== */
/*                              COMPONENT                                     */
/* ========================================================================== */

export function HomeSectionHeader({ title, action, onPress }: Props) {
  const c = useSemanticColors();

  const showAction = Boolean(action && onPress);

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------------- */}
      {/* TITLE                                                               */}
      {/* ------------------------------------------------------------------- */}

      <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
        {title}
      </ThemedText>

      {/* ------------------------------------------------------------------- */}
      {/* ACTION                                                              */}
      {/* ------------------------------------------------------------------- */}

      {showAction && (
        <Pressable
          onPress={onPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={action}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: pressed ? c.surfaceAlt : "transparent",
            },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.actionText,
              {
                color: c.primary,
              },
            ]}
          >
            {action}
          </ThemedText>

          <Ionicons name="chevron-forward" size={13} color={c.primary} />
        </Pressable>
      )}
    </View>
  );
}

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  container: {
    minHeight: 28,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 9,
  },

  title: {
    flex: 1,

    fontSize: 15,

    lineHeight: 20,

    fontWeight: "700",

    paddingRight: 10,
  },

  action: {
    minHeight: 28,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 2,

    borderRadius: 8,

    paddingHorizontal: 6,
  },

  actionText: {
    fontSize: 10,

    fontWeight: "700",
  },
});
