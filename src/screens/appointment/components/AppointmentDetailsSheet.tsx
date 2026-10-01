import { Appointment } from "@/types/appointment";
import { semanticTokens } from "@/tokens/semantic";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import React from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  formatDateLong,
  formatDateTime,
  formatDuration,
  formatTimeRange,
  getAppointmentStateConfig,
  getDentistFullName,
  getReasonShort,
  isFuture,
} from "../lib/appointmentHelpers";

import { styles } from "../styles";

type Props = {
  appointment: Appointment;
  onCancel: (appointment: Appointment) => void;
};

type RowProps = {
  icon: React.ComponentProps<typeof FontAwesome>["name"];

  label: string;

  value: string;
};

/* ========================================================================== */
/*                               DETAIL ROW                                   */
/* ========================================================================== */

function DetailRow({ icon, label, value }: RowProps) {
  const t = useSemanticColors();
  return (
    <View style={styles.sheetRow}>
      <View
        style={[
          styles.sheetIconCircle,
          {
            backgroundColor: t.surfaceAlt,
          },
        ]}
      >
        <FontAwesome name={icon} size={14} color={t.textSecondary} />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={[
            styles.sheetLabel,
            {
              color: t.textMuted,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.sheetValue,
            {
              color: t.textPrimary,
            },
          ]}
          numberOfLines={4}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ========================================================================== */
/*                             DETAILS SHEET                                  */
/* ========================================================================== */

export default function AppointmentDetailsSheet({ appointment, onCancel }: Props) {
  const t = useSemanticColors();
  const state = getAppointmentStateConfig(appointment);

  const reason = getReasonShort(appointment);

  const dentist = getDentistFullName(appointment);

  const canCancel = isFuture(appointment.start_datetime) && (appointment.state === "Programada" || appointment.state === "1");

  return (
    <ScrollView contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
      {/* =============================================================== */}
      {/* HEADER                                                          */}
      {/* =============================================================== */}

      <View style={styles.sheetHeader}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={[
              styles.sheetEyebrow,
              {
                color: "#005482",
              },
            ]}
          >
            CITA ODONTOLÓGICA
          </Text>

          <Text
            style={[
              styles.sheetTitle,
              {
                color: t.textPrimary,
              },
            ]}
          >
            Detalle de la cita
          </Text>

          <Text
            style={[
              styles.sheetSubtitle,
              {
                color: t.textSecondary,
              },
            ]}
          >
            Información de tu atención
          </Text>
        </View>

        <View
          style={[
            styles.stateChip,
            {
              borderColor: state.color,

              backgroundColor: state.bg,
            },
          ]}
        >
          <FontAwesome name={state.icon as any} size={9} color={state.color} />

          <Text
            style={[
              styles.stateChipText,
              {
                color: state.color,
              },
            ]}
          >
            {state.label}
          </Text>
        </View>
      </View>

      {/* =============================================================== */}
      {/* DATE HERO                                                       */}
      {/* =============================================================== */}

      <View style={styles.sheetDateHero}>
        <View>
          <Text style={styles.sheetDateHeroLabel}>FECHA</Text>

          <Text style={styles.sheetDateHeroDate}>{formatDateLong(appointment.start_datetime)}</Text>
        </View>

        <View style={styles.sheetDateHeroRight}>
          <Text style={styles.sheetDateHeroLabel}>HORARIO</Text>

          <Text style={styles.sheetDateHeroTime}>{formatTimeRange(appointment.start_datetime, appointment.end_datetime)}</Text>
        </View>
      </View>

      {/* =============================================================== */}
      {/* REASON                                                          */}
      {/* =============================================================== */}

      <View
        style={[
          styles.motiveBox,
          {
            backgroundColor: t.surface,

            borderColor: t.border,
          },
        ]}
      >
        <Text
          style={[
            styles.motiveLabel,
            {
              color: t.textMuted,
            },
          ]}
        >
          MOTIVO DE LA CITA
        </Text>

        <Text
          style={[
            styles.motiveText,
            {
              color: t.textPrimary,
            },
          ]}
        >
          {reason}
        </Text>
      </View>

      {/* =============================================================== */}
      {/* MAIN DATA                                                       */}
      {/* =============================================================== */}

      <View
        style={[
          styles.sheetCard,
          {
            backgroundColor: t.surface,

            borderColor: t.border,
          },
        ]}
      >
        <DetailRow icon="user-md" label="Odontólogo" value={dentist} />

        <View
          style={[
            styles.sheetDivider,
            {
              backgroundColor: t.border,
            },
          ]}
        />

        <DetailRow icon="clock-o" label="Duración" value={formatDuration(appointment.start_datetime, appointment.end_datetime)} />

        <View
          style={[
            styles.sheetDivider,
            {
              backgroundColor: t.border,
            },
          ]}
        />

        <DetailRow icon="calendar-plus-o" label="Cita registrada" value={formatDateTime(appointment.register_date)} />
      </View>

      {/* =============================================================== */}
      {/* CANCELLED                                                       */}
      {/* =============================================================== */}

      {appointment.state === "Cancelada" && (
        <View style={styles.sheetStatusSection}>
          <View style={styles.sheetStatusTitleRow}>
            <FontAwesome name="times-circle" size={15} color="#EF4444" />

            <Text
              style={[
                styles.sheetStatusTitle,
                {
                  color: t.textPrimary,
                },
              ]}
            >
              Información de cancelación
            </Text>
          </View>

          <View
            style={[
              styles.sheetStatusBox,
              {
                backgroundColor: t.surface,

                borderColor: t.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sheetStatusLabel,
                {
                  color: t.textMuted,
                },
              ]}
            >
              MOTIVO
            </Text>

            <Text
              style={[
                styles.sheetStatusValue,
                {
                  color: t.textPrimary,
                },
              ]}
            >
              {appointment.cancel_reason?.trim() || "No se registró un motivo."}
            </Text>

            {appointment.cancelled_at && (
              <>
                <View
                  style={[
                    styles.sheetDivider,
                    {
                      backgroundColor: t.border,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.sheetStatusLabel,
                    {
                      color: t.textMuted,
                    },
                  ]}
                >
                  CANCELADA EL
                </Text>

                <Text
                  style={[
                    styles.sheetStatusValue,
                    {
                      color: t.textPrimary,
                    },
                  ]}
                >
                  {formatDateTime(appointment.cancelled_at)}
                </Text>
              </>
            )}
          </View>
        </View>
      )}

      {/* =============================================================== */}
      {/* ATTENDED                                                        */}
      {/* =============================================================== */}

      {appointment.state === "Atendida" && appointment.attended_at && (
        <View
          style={[
            styles.attendedNotice,
            {
              backgroundColor: "rgba(16,185,129,0.08)",
            },
          ]}
        >
          <View style={styles.attendedIcon}>
            <FontAwesome name="check" size={13} color="#10B981" />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.attendedTitle}>Atención completada</Text>

            <Text
              style={[
                styles.attendedDescription,
                {
                  color: t.textSecondary,
                },
              ]}
            >
              Atendida el {formatDateTime(appointment.attended_at)}
            </Text>
          </View>
        </View>
      )}

      {/* =============================================================== */}
      {/* RESCHEDULED                                                     */}
      {/* =============================================================== */}

      {(appointment.state === "Reprogramada" || appointment.rescheduled_from_id) && (
        <View
          style={[
            styles.rescheduledNotice,
            {
              backgroundColor: "rgba(139,92,246,0.08)",
            },
          ]}
        >
          <View style={styles.rescheduledIcon}>
            <FontAwesome name="refresh" size={13} color="#8B5CF6" />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.rescheduledTitle}>Cita reprogramada</Text>

            <Text
              style={[
                styles.rescheduledDescription,
                {
                  color: t.textSecondary,
                },
              ]}
            >
              Esta cita forma parte de una reprogramación. Consulta tus próximas citas para revisar la fecha vigente.
            </Text>
          </View>
        </View>
      )}

      {/* =============================================================== */}
      {/* CANCEL ACTION                                                   */}
      {/* =============================================================== */}

      {canCancel && (
        <View style={styles.sheetDangerSection}>
          <Text
            style={[
              styles.sheetDangerLabel,
              {
                color: t.textMuted,
              },
            ]}
          >
            ¿No podrás asistir?
          </Text>

          <TouchableOpacity style={styles.dangerButton} activeOpacity={0.82} onPress={() => onCancel(appointment)}>
            <FontAwesome name="times" size={12} color="#EF4444" />

            <Text style={styles.dangerButtonText}>Cancelar cita</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
