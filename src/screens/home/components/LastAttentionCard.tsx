import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { PatientHomeLastAttention } from "@/types/home";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { formatAppointmentDate } from "../lib/formatters";

type Props = {
  attention: PatientHomeLastAttention;

  onPress: () => void;
};

export function LastAttentionCard({ attention, onPress }: Props) {
  const c = useSemanticColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,

        {
          borderColor: c.border,

          backgroundColor: c.surface,

          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View style={styles.timeline}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: "rgba(16,185,129,0.10)",
            },
          ]}
        >
          <Ionicons name="checkmark" size={16} color={c.success} />
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
          {attention.procedure || "Atención dental"}
        </ThemedText>

        <ThemedText
          type="default"
          style={[
            styles.date,
            {
              color: c.textSecondary,
            },
          ]}
        >
          {formatAppointmentDate(attention.date)}
        </ThemedText>

        {attention.dentist?.name && (
          <ThemedText
            type="default"
            style={[
              styles.dentist,
              {
                color: c.textMuted,
              },
            ]}
            numberOfLines={1}
          >
            {attention.dentist.name}
          </ThemedText>
        )}
      </View>

      <Ionicons name="chevron-forward" size={15} color={c.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,

    borderRadius: 16,

    paddingHorizontal: 12,

    paddingVertical: 11,

    flexDirection: "row",

    alignItems: "center",
  },

  timeline: {
    marginRight: 10,
  },

  icon: {
    width: 38,

    height: 38,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 12,

    fontWeight: "700",
  },

  date: {
    marginTop: 2,

    fontSize: 9,
  },

  dentist: {
    marginTop: 2,

    fontSize: 9,
  },
});
