import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { PatientHomeAppointment } from "@/types/home";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { formatAppointmentDate, formatAppointmentTimeRange, formatRelativeAppointmentDate } from "../lib/formatters";

type Props = {
  appointment: PatientHomeAppointment;

  onPress: () => void;
};

export function NextAppointmentCard({ appointment, onPress }: Props) {
  const c = useSemanticColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,

        {
          backgroundColor: c.surface,

          borderColor: c.border,

          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.accent,
          {
            backgroundColor: c.primary,
          },
        ]}
      />

      <View style={styles.top}>
        <View style={styles.dateContent}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.relative,
              {
                color: c.primary,
              },
            ]}
          >
            {formatRelativeAppointmentDate(appointment.startDatetime)}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.date}>
            {formatAppointmentDate(appointment.startDatetime)}
          </ThemedText>
        </View>

        <View
          style={[
            styles.timeBadge,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Ionicons name="time-outline" size={13} color={c.primary} />

          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.time,
              {
                color: c.primary,
              },
            ]}
          >
            {formatAppointmentTimeRange(appointment.startDatetime, appointment.endDatetime)}
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: c.border,
          },
        ]}
      />

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={15} color={c.textMuted} />

        <ThemedText
          type="default"
          style={[
            styles.infoText,
            {
              color: c.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {appointment.dentist?.name || "Odontólogo por definir"}
        </ThemedText>
      </View>

      {appointment.reason && (
        <View style={styles.infoRow}>
          <Ionicons name="medical-outline" size={15} color={c.textMuted} />

          <ThemedText
            type="default"
            style={[
              styles.infoText,
              {
                color: c.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {appointment.reason}
          </ThemedText>
        </View>
      )}

      <View style={styles.footer}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.details,
            {
              color: c.primary,
            },
          ]}
        >
          Ver cita
        </ThemedText>

        <Ionicons name="arrow-forward" size={14} color={c.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",

    borderWidth: 1,

    borderRadius: 18,

    padding: 15,

    position: "relative",
  },

  accent: {
    position: "absolute",

    left: 0,

    top: 0,

    bottom: 0,

    width: 4,
  },

  top: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",

    gap: 10,
  },

  dateContent: {
    flex: 1,
  },

  relative: {
    fontSize: 10,

    fontWeight: "800",

    textTransform: "uppercase",

    marginBottom: 3,
  },

  date: {
    fontSize: 14,

    lineHeight: 19,

    fontWeight: "700",
  },

  timeBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,

    borderRadius: 10,

    paddingHorizontal: 9,

    paddingVertical: 7,
  },

  time: {
    fontSize: 10,

    fontWeight: "700",
  },

  divider: {
    height: StyleSheet.hairlineWidth,

    marginVertical: 12,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 7,

    marginBottom: 6,
  },

  infoText: {
    flex: 1,

    fontSize: 11,
  },

  footer: {
    flexDirection: "row",

    alignItems: "center",

    alignSelf: "flex-end",

    gap: 4,

    marginTop: 7,
  },

  details: {
    fontSize: 10,

    fontWeight: "700",
  },
});
