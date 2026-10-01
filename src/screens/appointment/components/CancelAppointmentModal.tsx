import { Appointment } from "@/types/appointment";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import React, { useEffect, useMemo, useState } from "react";

import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  visible: boolean;

  appointment: Appointment | null;

  loading?: boolean;

  onCancel: (reason: string) => void | Promise<void>;

  onClose: () => void;
};

/* ========================================================================== */
/*                                  HELPERS                                   */
/* ========================================================================== */

function formatDate(iso: string): string {
  const date = new Date(iso);

  const value = date.toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/* ========================================================================== */
/*                           CANCEL APPOINTMENT MODAL                         */
/* ========================================================================== */

export default function CancelAppointmentModal({ visible, appointment, loading = false, onCancel, onClose }: Props) {
  const c = useSemanticColors();

  const [reason, setReason] = useState("");

  const normalizedReason = reason.trim();

  const isValid = normalizedReason.length >= 3 && normalizedReason.length <= 200;

  /* ----------------------------------------------------------------------- */
  /* RESET                                                                   */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (visible) {
      setReason("");
    }
  }, [visible, appointment?.id]);

  /* ----------------------------------------------------------------------- */
  /* APPOINTMENT INFO                                                        */
  /* ----------------------------------------------------------------------- */

  const appointmentInfo = useMemo(() => {
    if (!appointment) {
      return null;
    }

    return {
      date: formatDate(appointment.start_datetime),

      time: `${formatTime(appointment.start_datetime)} - ${formatTime(appointment.end_datetime)}`,

      dentist: [appointment.dentistName, appointment.dentistLastName].filter(Boolean).join(" "),
    };
  }, [appointment]);

  /* ----------------------------------------------------------------------- */
  /* SUBMIT                                                                  */
  /* ----------------------------------------------------------------------- */

  const handleCancel = () => {
    if (!isValid || loading) {
      return;
    }

    onCancel(normalizedReason);
  };

  if (!appointment) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={loading ? undefined : onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* =============================================================== */}
        {/* BACKDROP                                                        */}
        {/* =============================================================== */}

        <Pressable style={StyleSheet.absoluteFill} disabled={loading} onPress={onClose} />

        {/* =============================================================== */}
        {/* CARD                                                            */}
        {/* =============================================================== */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: c.surface,

              borderColor: c.border,
            },
          ]}
        >
          {/* ============================================================= */}
          {/* ICON                                                          */}
          {/* ============================================================= */}

          <View
            style={[
              styles.icon,
              {
                backgroundColor: "rgba(239,68,68,0.10)",
              },
            ]}
          >
            <MaterialIcons name="event-busy" size={23} color={c.danger} />
          </View>

          {/* ============================================================= */}
          {/* TITLE                                                         */}
          {/* ============================================================= */}

          <Text
            style={[
              styles.title,
              {
                color: c.textPrimary,
              },
            ]}
          >
            Cancelar cita
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: c.textSecondary,
              },
            ]}
          >
            Esta acción cancelará tu cita y liberará el horario para otro paciente.
          </Text>

          {/* ============================================================= */}
          {/* APPOINTMENT                                                   */}
          {/* ============================================================= */}

          {appointmentInfo && (
            <View
              style={[
                styles.appointmentBox,
                {
                  backgroundColor: c.surfaceAlt,

                  borderColor: c.border,
                },
              ]}
            >
              <View style={styles.appointmentRow}>
                <MaterialIcons name="calendar-today" size={14} color={c.textMuted} />

                <Text
                  style={[
                    styles.appointmentText,
                    {
                      color: c.textPrimary,
                    },
                  ]}
                >
                  {appointmentInfo.date}
                </Text>
              </View>

              <View style={styles.appointmentRow}>
                <MaterialIcons name="schedule" size={14} color={c.textMuted} />

                <Text
                  style={[
                    styles.appointmentText,
                    {
                      color: c.textPrimary,
                    },
                  ]}
                >
                  {appointmentInfo.time}
                </Text>
              </View>

              <View style={styles.appointmentRow}>
                <MaterialIcons name="medical-services" size={14} color={c.textMuted} />

                <Text
                  style={[
                    styles.appointmentText,
                    {
                      color: c.textPrimary,
                    },
                  ]}
                >
                  Dr. {appointmentInfo.dentist}
                </Text>
              </View>
            </View>
          )}

          {/* ============================================================= */}
          {/* REASON                                                        */}
          {/* ============================================================= */}

          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text
                style={[
                  styles.label,
                  {
                    color: c.textPrimary,
                  },
                ]}
              >
                Motivo de cancelación
              </Text>

              <Text
                style={[
                  styles.counter,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                {reason.length}
                /200
              </Text>
            </View>

            <TextInput
              value={reason}
              onChangeText={(value) => setReason(value.slice(0, 200))}
              placeholder="Ej. No podré asistir por motivos personales"
              placeholderTextColor={c.textMuted}
              multiline
              editable={!loading}
              textAlignVertical="top"
              maxLength={200}
              style={[
                styles.input,
                {
                  color: c.textPrimary,

                  backgroundColor: c.surfaceAlt,

                  borderColor: reason.length > 0 && !isValid ? c.danger : c.border,
                },
              ]}
            />

            {reason.length > 0 && !isValid && (
              <Text
                style={[
                  styles.error,
                  {
                    color: c.danger,
                  },
                ]}
              >
                Escribe al menos 3 caracteres.
              </Text>
            )}
          </View>

          {/* ============================================================= */}
          {/* ACTIONS                                                       */}
          {/* ============================================================= */}

          <View style={styles.actions}>
            <Pressable
              disabled={loading}
              onPress={onClose}
              style={[
                styles.secondaryButton,
                {
                  borderColor: c.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color: c.textPrimary,
                  },
                ]}
              >
                Volver
              </Text>
            </Pressable>

            <Pressable
              disabled={!isValid || loading}
              onPress={handleCancel}
              style={[
                styles.dangerButton,
                {
                  backgroundColor: c.danger,

                  opacity: !isValid || loading ? 0.45 : 1,
                },
              ]}
            >
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <MaterialIcons name="close" size={16} color="#FFFFFF" />}

              <Text style={styles.dangerText}>{loading ? "Cancelando..." : "Cancelar cita"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.42)",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 18,
  },

  card: {
    width: "100%",

    maxWidth: 360,

    borderRadius: 20,

    borderWidth: 1,

    padding: 18,

    elevation: 10,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowRadius: 18,
  },

  icon: {
    width: 44,

    height: 44,

    borderRadius: 14,

    alignSelf: "center",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 10,
  },

  title: {
    fontSize: 18,

    lineHeight: 23,

    fontWeight: "700",

    textAlign: "center",
  },

  description: {
    marginTop: 5,

    fontSize: 11,

    lineHeight: 17,

    textAlign: "center",

    paddingHorizontal: 8,
  },

  appointmentBox: {
    marginTop: 15,

    borderWidth: 1,

    borderRadius: 13,

    paddingHorizontal: 12,

    paddingVertical: 9,

    gap: 7,
  },

  appointmentRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },

  appointmentText: {
    flex: 1,

    fontSize: 10,

    lineHeight: 14,

    fontWeight: "500",
  },

  field: {
    marginTop: 16,
  },

  fieldHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 6,
  },

  label: {
    fontSize: 11,

    fontWeight: "700",
  },

  counter: {
    fontSize: 8,
  },

  input: {
    minHeight: 82,

    maxHeight: 120,

    borderWidth: 1,

    borderRadius: 12,

    paddingHorizontal: 11,

    paddingVertical: 10,

    fontSize: 11,

    lineHeight: 16,
  },

  error: {
    fontSize: 9,

    marginTop: 4,
  },

  actions: {
    flexDirection: "row",

    gap: 8,

    marginTop: 18,
  },

  secondaryButton: {
    flex: 1,

    minHeight: 44,

    borderWidth: 1,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",
  },

  secondaryText: {
    fontSize: 11,

    fontWeight: "700",
  },

  dangerButton: {
    flex: 1.35,

    minHeight: 44,

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,
  },

  dangerText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "700",
  },
});
