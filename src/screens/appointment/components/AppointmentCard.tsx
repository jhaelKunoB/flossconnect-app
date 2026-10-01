import { Appointment } from "@/types/appointment";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import {
  formatDuration,
  formatTime,
  getAppointmentStateConfig,
  getDentistFullName,
  getReasonShort,
} from "../lib/appointmentHelpers";

import { styles } from "../styles";

type Props = {
  appointment: Appointment;

  onPress: (
    appointment: Appointment
  ) => void;
};

export default function AppointmentCard({
  appointment,
  onPress,
}: Props) {
  const t =
    useSemanticColors();

  const state =
    getAppointmentStateConfig(
      appointment
    );

  const time =
    formatTime(
      appointment.start_datetime
    );

  const duration =
    formatDuration(
      appointment.start_datetime,
      appointment.end_datetime
    );

  const reason =
    getReasonShort(
      appointment
    );

  const dentist =
    getDentistFullName(
      appointment
    );

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={() =>
        onPress(
          appointment
        )
      }
      style={[
        styles.appointmentCard,
        {
          backgroundColor:
            t.surface,

          borderColor:
            t.border,
        },
      ]}
    >
      {/* =============================================================== */}
      {/* HORA                                                            */}
      {/* =============================================================== */}

      <View
        style={
          styles.appointmentTimeColumn
        }
      >
        <Text
          style={[
            styles.appointmentTime,
            {
              color:
                t.textPrimary,
            },
          ]}
        >
          {time}
        </Text>

        <View
          style={[
            styles.appointmentTimelineDot,
            {
              backgroundColor:
                state.color,
            },
          ]}
        />

        <View
          style={[
            styles.appointmentTimelineLine,
            {
              backgroundColor:
                t.border,
            },
          ]}
        />
      </View>

      {/* =============================================================== */}
      {/* CONTENIDO                                                       */}
      {/* =============================================================== */}

      <View
        style={
          styles.appointmentContent
        }
      >
        <View
          style={
            styles.appointmentHeader
          }
        >
          <View
            style={{
              flex: 1,
              paddingRight: 8,
            }}
          >
            <Text
              style={[
                styles.appointmentTitle,
                {
                  color:
                    t.textPrimary,
                },
              ]}
              numberOfLines={2}
            >
              {reason}
            </Text>

            <View
              style={
                styles.appointmentDentistRow
              }
            >
              <FontAwesome
                name="user-md"
                size={11}
                color={
                  t.textMuted
                }
              />

              <Text
                style={[
                  styles.appointmentDentist,
                  {
                    color:
                      t.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {dentist}
              </Text>
            </View>
          </View>

          {/* =========================================================== */}
          {/* ESTADO                                                      */}
          {/* =========================================================== */}

          <View
            style={[
              styles.stateChip,
              {
                backgroundColor:
                  state.bg,

                borderColor:
                  state.color,
              },
            ]}
          >
            <FontAwesome
              name={
                state.icon as any
              }
              size={9}
              color={
                state.color
              }
            />

            <Text
              style={[
                styles.stateChipText,
                {
                  color:
                    state.color,
                },
              ]}
            >
              {state.label}
            </Text>
          </View>
        </View>

        {/* ============================================================= */}
        {/* META                                                          */}
        {/* ============================================================= */}

        <View
          style={
            styles.appointmentMetaRow
          }
        >
          <View
            style={
              styles.appointmentMetaItem
            }
          >
            <FontAwesome
              name="clock-o"
              size={11}
              color={
                t.textMuted
              }
            />

            <Text
              style={[
                styles.appointmentMetaText,
                {
                  color:
                    t.textMuted,
                },
              ]}
            >
              {duration}
            </Text>
          </View>

          {appointment.rescheduled_from_id && (
            <View
              style={
                styles.appointmentMetaItem
              }
            >
              <FontAwesome
                name="refresh"
                size={10}
                color={
                  t.violet
                }
              />

              <Text
                style={[
                  styles.appointmentMetaText,
                  {
                    color:
                      t.violet,
                  },
                ]}
              >
                Reprogramada
              </Text>
            </View>
          )}
        </View>

        {/* ============================================================= */}
        {/* FOOTER                                                        */}
        {/* ============================================================= */}

        <View
          style={
            styles.appointmentBottom
          }
        >
          <Text
            style={[
              styles.appointmentOpenText,
              {
                color:
                  t.primary,
              },
            ]}
          >
            Ver detalles
          </Text>

          <FontAwesome
            name="chevron-right"
            size={10}
            color={
              t.primary
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}