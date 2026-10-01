import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { PatientHomeTreatment } from "@/types/home";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { formatShortDate } from "../lib/formatters";

type Props = {
  treatment: PatientHomeTreatment;

  onPress: () => void;
};

function getTreatmentStatus(status: string) {
  switch (status) {
    case "activo":
      return "Activo";

    case "planificado":
      return "Planificado";

    case "pausado":
      return "Pausado";

    default:
      return status;
  }
}

export function TreatmentOverviewCard({ treatment, onPress }: Props) {
  const c = useSemanticColors();

  const progress = treatment.totalProcedures > 0 ? Math.min(treatment.completedProcedures / treatment.totalProcedures, 1) : 0;

  const percentage = Math.round(progress * 100);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,

        {
          backgroundColor: c.surface,

          borderColor: c.border,

          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Ionicons name="medical" size={18} color={c.primary} />
        </View>

        <View style={styles.titleContent}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
            {treatment.name}
          </ThemedText>

          <ThemedText
            type="default"
            style={[
              styles.status,
              {
                color: c.textSecondary,
              },
            ]}
          >
            {getTreatmentStatus(treatment.status)}
          </ThemedText>
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.percentage,
            {
              color: c.primary,
            },
          ]}
        >
          {percentage}%
        </ThemedText>
      </View>

      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor: c.surfaceAlt,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,

              backgroundColor: c.primary,
            },
          ]}
        />
      </View>

      <ThemedText
        type="default"
        style={[
          styles.progressText,
          {
            color: c.textSecondary,
          },
        ]}
      >
        {treatment.completedProcedures} de {treatment.totalProcedures} procedimientos completados
      </ThemedText>

      <View
        style={[
          styles.next,
          {
            backgroundColor: c.surfaceAlt,
          },
        ]}
      >
        <View style={styles.nextIcon}>
          <Ionicons name="arrow-forward-circle-outline" size={17} color={c.primary} />
        </View>

        <View style={styles.nextContent}>
          <ThemedText
            type="default"
            style={[
              styles.nextLabel,
              {
                color: c.textMuted,
              },
            ]}
          >
            Próximo procedimiento
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.nextValue} numberOfLines={1}>
            {treatment.nextProcedure || "Por definir"}
          </ThemedText>
        </View>

        {treatment.nextDate && (
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.nextDate,
              {
                color: c.primary,
              },
            ]}
          >
            {formatShortDate(treatment.nextDate)}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,

    borderRadius: 18,

    padding: 15,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",
  },

  icon: {
    width: 38,

    height: 38,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",
  },

  titleContent: {
    flex: 1,

    marginLeft: 10,
  },

  title: {
    fontSize: 13,

    fontWeight: "700",
  },

  status: {
    marginTop: 2,

    fontSize: 9,

    textTransform: "capitalize",
  },

  percentage: {
    fontSize: 15,

    fontWeight: "800",
  },

  progressTrack: {
    height: 6,

    borderRadius: 999,

    overflow: "hidden",

    marginTop: 14,
  },

  progressFill: {
    height: "100%",

    borderRadius: 999,
  },

  progressText: {
    fontSize: 9,

    marginTop: 6,
  },

  next: {
    marginTop: 13,

    borderRadius: 12,

    paddingHorizontal: 10,

    paddingVertical: 9,

    flexDirection: "row",

    alignItems: "center",
  },

  nextIcon: {
    marginRight: 8,
  },

  nextContent: {
    flex: 1,
  },

  nextLabel: {
    fontSize: 8,

    marginBottom: 2,
  },

  nextValue: {
    fontSize: 10,

    fontWeight: "700",
  },

  nextDate: {
    fontSize: 9,

    marginLeft: 8,
  },
});
