import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router/react-navigation";

import React, { useCallback, useMemo, useRef, useState } from "react";

import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

import { getAppointmentsByPatient, updateAppointmentState } from "@/api/services/appointment";
import CancelAppointmentModal from "./components/CancelAppointmentModal";

import Header from "@/components/HeaderScreen";
import ModalMessage from "@/components/ModalMessage";
import { ThemedView } from "@/components/themed-view";

import { usePatientAuth } from "@/hooks/useAuth";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { Appointment } from "@/types/appointment";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import AppointmentCard from "./components/AppointmentCard";
import AppointmentDetailsSheet from "./components/AppointmentDetailsSheet";
import AppointmentsSummary from "./components/AppointmentsSummary";
import EmptyAppointments from "./components/EmptyAppointments";

import {
  buildSummary,
  formatDateBadgeDay,
  formatDateBadgeMonth,
  formatHeaderDate,
  formatTimeRange,
  getAppointmentStateConfig,
  getDateKey,
  getDentistFullName,
  getReasonShort,
  getRelativeAppointmentLabel,
  isUpcomingAppointment,
} from "./lib/appointmentHelpers";

import { styles } from "./styles";

/* ========================================================================== */
/*                                FILTER TYPES                                */
/* ========================================================================== */

type Filter = "upcoming" | "history" | "all";

const FILTERS: {
  key: Filter;
  label: string;
}[] = [
  {
    key: "upcoming",
    label: "Próximas",
  },
  {
    key: "history",
    label: "Historial",
  },
  {
    key: "all",
    label: "Todas",
  },
];

/* ========================================================================== */
/*                                MAIN SCREEN                                 */
/* ========================================================================== */

export default function AppointmentsScreen() {
  const router = useRouter();

  const detailsSheetRef = useRef<ActionSheetRef>(null);

  const { user } = usePatientAuth();

  const t = useSemanticColors();

  const insets = useSafeAreaInsets();

  /* ----------------------------------------------------------------------- */
  /*                                  STATE                                  */
  /* ----------------------------------------------------------------------- */

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [filter, setFilter] = useState<Filter>("upcoming");

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const [cancelAppt, setCancelAppt] = useState<Appointment | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [infoModalMsg, setInfoModalMsg] = useState("");

  const [cancelLoading, setCancelLoading] = useState(false);

  /* ----------------------------------------------------------------------- */
  /*                               MESSAGE                                   */
  /* ----------------------------------------------------------------------- */

  const showMessage = (message: string) => {
    setInfoModalMsg(message);

    setInfoModalVisible(true);
  };

  /* ----------------------------------------------------------------------- */
  /*                                  FETCH                                  */
  /* ----------------------------------------------------------------------- */

  const fetchAppointments = useCallback(
    async (isRefresh = false) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const clinicId = user.clinic?.id;

      if (!clinicId) {
        setAppointments([]);
        setLoading(false);
        setRefreshing(false);

        showMessage("No se encontró una clínica asociada a tu cuenta.");

        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getAppointmentsByPatient(clinicId, user.id, user.role);

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching appointments:", error);

        showMessage("No se pudieron cargar tus citas.");
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments]),
  );

  /* ----------------------------------------------------------------------- */
  /*                              DERIVED DATA                               */
  /* ----------------------------------------------------------------------- */

  const summary = useMemo(() => buildSummary(appointments), [appointments]);

  /* ----------------------------------------------------------------------- */
  /*                              NEXT APPOINTMENT                           */
  /* ----------------------------------------------------------------------- */

  const nextAppointment = useMemo(() => {
    const upcoming = appointments
      .filter(isUpcomingAppointment)
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());

    return upcoming[0] ?? null;
  }, [appointments]);

  /* ----------------------------------------------------------------------- */
  /*                              FILTERED LIST                              */
  /* ----------------------------------------------------------------------- */

  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    /* ------------------------------------------------------------------- */
    /* PRÓXIMAS                                                            */
    /* ------------------------------------------------------------------- */

    if (filter === "upcoming") {
      list = list.filter(isUpcomingAppointment).sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
    }

    /* ------------------------------------------------------------------- */
    /* HISTORIAL                                                           */
    /* ------------------------------------------------------------------- */

    if (filter === "history") {
      list = list
        .filter((appointment) => !isUpcomingAppointment(appointment))
        .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime());
    }

    /* ------------------------------------------------------------------- */
    /* TODAS                                                               */
    /* ------------------------------------------------------------------- */

    if (filter === "all") {
      const upcoming = list.filter(isUpcomingAppointment).sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());

      const history = list
        .filter((appointment) => !isUpcomingAppointment(appointment))
        .sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime());

      list = [...upcoming, ...history];
    }

    /* ------------------------------------------------------------------- */
    /* QUITAR LA PRÓXIMA CITA REPETIDA                                    */
    /* ------------------------------------------------------------------- */

    if (nextAppointment) {
      list = list.filter((appointment) => appointment.id !== nextAppointment.id);
    }

    return list;
  }, [appointments, filter, nextAppointment]);

  /* ----------------------------------------------------------------------- */
  /*                               LIST TITLE                                */
  /* ----------------------------------------------------------------------- */

  const listTitle = useMemo(() => {
    switch (filter) {
      case "upcoming":
        return nextAppointment ? "Otras próximas citas" : "Próximas citas";

      case "history":
        return "Historial de citas";

      case "all":
      default:
        return "Todas las citas";
    }
  }, [filter, nextAppointment]);

  /* ----------------------------------------------------------------------- */
  /*                                ACTIONS                                  */
  /* ----------------------------------------------------------------------- */

  const handleOpenForm = () => {
    router.push("/(Appointment)/form_appointment");
  };


  
  const handleOpenDetails = (appointment: Appointment) => {
    setSelectedAppt(appointment);

    detailsSheetRef.current?.show();
  };

  /* ----------------------------------------------------------------------- */
  /*                              CANCEL APPOINTMENT                         */
  /* ----------------------------------------------------------------------- */

  const doCancelAppointment = async (cancelReason: string) => {
    if (!cancelAppt || !user) {
      return;
    }

    try {
      setCancelLoading(true);

      await updateAppointmentState(
        cancelAppt.id,
        "Cancelada",
        {
          cancelReason,
          idUserAction: user.id,
        },
      );

      setCancelAppt(null);
      showMessage("Tu cita ha sido cancelada correctamente.");

      await fetchAppointments(true);
    } catch (error) {
      console.error("Error cancelando cita:", error);

      showMessage("No se pudo cancelar la cita.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRequestCancel = (appointment: Appointment) => {
    detailsSheetRef.current?.hide();

    /*
     * Esperamos a que termine la animación
     * del ActionSheet antes de abrir el Modal.
     */
    setTimeout(() => {
      setCancelAppt(appointment);
    }, 250);
  };

  /* ----------------------------------------------------------------------- */
  /*                            GROUPED LIST                                 */
  /* ----------------------------------------------------------------------- */

  const renderGroupedList = () => {
    /* ------------------------------------------------------------------- */
    /* EMPTY                                                               */
    /* ------------------------------------------------------------------- */

    if (filteredAppointments.length === 0) {
      if (appointments.length === 0) {
        return <EmptyAppointments onSchedule={handleOpenForm} variant="no-appointments" />;
      }

      if (filter === "upcoming" && nextAppointment) {
        return <EmptyAppointments onSchedule={handleOpenForm} variant="no-more-upcoming" />;
      }

      if (filter === "upcoming") {
        return <EmptyAppointments onSchedule={handleOpenForm} variant="no-upcoming" />;
      }

      return <EmptyAppointments onSchedule={handleOpenForm} variant="no-filtered" />;
    }

    /* ------------------------------------------------------------------- */
    /* LIST                                                                */
    /* ------------------------------------------------------------------- */

    return filteredAppointments.map((appointment, index) => {
      const dateKey = getDateKey(appointment.start_datetime);

      const previousDateKey = index > 0 ? getDateKey(filteredAppointments[index - 1].start_datetime) : null;

      const showHeader = dateKey !== previousDateKey;

      return (
        <View key={appointment.id}>
          {showHeader && (
            <Text
              style={[
                styles.dateHeader,
                {
                  color: t.textSecondary,
                },
              ]}
            >
              {formatHeaderDate(appointment.start_datetime).toUpperCase()}
            </Text>
          )}

          <AppointmentCard appointment={appointment} onPress={handleOpenDetails} />
        </View>
      );
    });
  };

  /* ----------------------------------------------------------------------- */
  /*                               LOADING                                   */
  /* ----------------------------------------------------------------------- */

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <Header
          showBackButton={false}
          title="Mis citas"
          rightComponent={
            <TouchableOpacity onPress={handleOpenForm} accessibilityLabel="Agendar cita" activeOpacity={0.7}>
              <FontAwesome name="calendar-plus-o" size={23} color={t.textPrimary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.loadingIcon,
              {
                backgroundColor: t.surfaceAlt,
              },
            ]}
          >
            <FontAwesome name="calendar" size={25} color={t.primary} />
          </View>

          <ActivityIndicator
            size="small"
            color={t.primary}
            style={{
              marginTop: 18,
            }}
          />

          <Text
            style={[
              styles.loadingText,
              {
                color: t.textSecondary,
              },
            ]}
          >
            Cargando tus citas...
          </Text>
        </View>
      </ThemedView>
    );
  }

  /* ----------------------------------------------------------------------- */
  /*                                RENDER                                   */
  /* ----------------------------------------------------------------------- */

  return (
    <ThemedView style={styles.container}>
    
      {/* ================================================================= */}
      {/* CONTENT                                                          */}
      {/* ================================================================= */}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchAppointments(true)} tintColor={t.primary} />}
      >
        {/* =============================================================== */}
        {/* INTRO                                                           */}
        {/* =============================================================== */}

        <View style={styles.introSection}>
          <Text
            style={[
              styles.introEyebrow,
              {
                color: t.primary,
              },
            ]}
          >
            AGENDA PERSONAL
          </Text>

          <Text
            style={[
              styles.introTitle,
              {
                color: t.textPrimary,
              },
            ]}
          >
            Organiza tus atenciones
          </Text>

          <Text
            style={[
              styles.introDescription,
              {
                color: t.textSecondary,
              },
            ]}
          >
            Consulta tus próximas citas, revisa tu historial y agenda una nueva atención cuando la necesites.
          </Text>
        </View>

        {/* =============================================================== */}
        {/* PRÓXIMA CITA                                                    */}
        {/* =============================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: t.textPrimary,
                },
              ]}
            >
              Próxima cita
            </Text>

            {nextAppointment && (
              <Text
                style={[
                  styles.sectionHint,
                  {
                    color: t.textMuted,
                  },
                ]}
              >
                Tu siguiente atención
              </Text>
            )}
          </View>

          {nextAppointment ? (
            <FeaturedAppointment appointment={nextAppointment} onPress={() => handleOpenDetails(nextAppointment)} />
          ) : (
            <View
              style={[
                styles.noNextCard,
                {
                  backgroundColor: t.surface,

                  borderColor: t.border,
                },
              ]}
            >
              <View
                style={[
                  styles.noNextIcon,
                  {
                    backgroundColor: t.surfaceAlt,
                  },
                ]}
              >
                <FontAwesome name="calendar-o" size={20} color={t.primary} />
              </View>

              <View style={styles.noNextContent}>
                <Text
                  style={[
                    styles.noNextTitle,
                    {
                      color: t.textPrimary,
                    },
                  ]}
                >
                  No tienes una cita próxima
                </Text>

                <Text
                  style={[
                    styles.noNextDescription,
                    {
                      color: t.textSecondary,
                    },
                  ]}
                >
                  Agenda una nueva atención cuando lo necesites.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* =============================================================== */}
        {/* CTA AGENDAR                                                     */}
        {/* =============================================================== */}

        {appointments.length > 0 && (
          <TouchableOpacity
            style={[
              styles.scheduleButton,
              {
                backgroundColor: t.primary,
              },
            ]}
            activeOpacity={0.86}
            onPress={handleOpenForm}
          >
            <View style={styles.scheduleButtonIcon}>
              <FontAwesome name="calendar-plus-o" size={16} color="#FFFFFF" />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={styles.scheduleButtonTitle}>Agendar nueva cita</Text>

              <Text style={styles.scheduleButtonSubtitle}>Elige odontólogo, fecha y horario</Text>
            </View>

            <FontAwesome name="chevron-right" size={12} color="rgba(255,255,255,0.82)" />
          </TouchableOpacity>
        )}

        {/* =============================================================== */}
        {/* RESUMEN                                                         */}
        {/* =============================================================== */}

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: t.textPrimary,
              },
            ]}
          >
            Resumen
          </Text>

          <AppointmentsSummary upcoming={summary.upcoming} attended={summary.attended} cancelled={summary.cancelled} />
        </View>

        {/* =============================================================== */}
        {/* FILTROS                                                         */}
        {/* =============================================================== */}

        <View style={styles.section}>
          <View
            style={[
              styles.segmentedControl,
              {
                backgroundColor: t.surface,

                borderColor: t.border,
              },
            ]}
          >
            {FILTERS.map((item) => {
              const active = filter === item.key;

              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.85}
                  onPress={() => setFilter(item.key)}
                  style={[
                    styles.segmentedItem,

                    active && {
                      backgroundColor: t.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentedText,
                      {
                        color: active ? t.primaryContrast : t.textSecondary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =============================================================== */}
        {/* LIST TITLE                                                      */}
        {/* =============================================================== */}

        <View style={styles.listHeader}>
          <Text
            style={[
              styles.listTitle,
              {
                color: t.textPrimary,
              },
            ]}
          >
            {listTitle}
          </Text>

          <Text
            style={[
              styles.listSubtitle,
              {
                color: t.textMuted,
              },
            ]}
          >
            {filteredAppointments.length} {filteredAppointments.length === 1 ? "cita" : "citas"}
          </Text>
        </View>

        {/* =============================================================== */}
        {/* LISTADO                                                         */}
        {/* =============================================================== */}

        {renderGroupedList()}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* ================================================================= */}
      {/* DETAIL SHEET                                                     */}
      {/* ================================================================= */}

      <ActionSheet ref={detailsSheetRef} gestureEnabled>
        {selectedAppt && <AppointmentDetailsSheet appointment={selectedAppt} onCancel={handleRequestCancel} />}
      </ActionSheet>

      {/* ================================================================= */}
      {/* INFO MODAL                                                       */}
      {/* ================================================================= */}

      <ModalMessage
        visible={infoModalVisible}
        title="Aviso"
        message={infoModalMsg}
        variant={infoModalMsg.includes("correctamente") ? "success" : "info"}
        onPrimary={() => setInfoModalVisible(false)}
        onRequestClose={() => setInfoModalVisible(false)}
      />

      {/* ================================================================= */}
      {/* CANCEL MODAL                                                     */}
      {/* ================================================================= */}

      <CancelAppointmentModal
        visible={!!cancelAppt}
        appointment={cancelAppt}
        loading={cancelLoading}
        onCancel={doCancelAppointment}
        onClose={() => {
          if (cancelLoading) {
            return;
          }
          setCancelAppt(null);
        }}
      />

    </ThemedView>
  );
}

/* ========================================================================== */
/*                         FEATURED APPOINTMENT                               */
/* ========================================================================== */

type FeaturedAppointmentProps = {
  appointment: Appointment;

  onPress: () => void;
};

function FeaturedAppointment({ appointment, onPress }: FeaturedAppointmentProps) {
  const t = useSemanticColors();

  const state = getAppointmentStateConfig(appointment);

  const reason = getReasonShort(appointment);

  const dentist = getDentistFullName(appointment);

  const relative = getRelativeAppointmentLabel(appointment.start_datetime);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.featuredCard,
        {
          backgroundColor: t.primary,
        },
      ]}
    >
      {/* =============================================================== */}
      {/* DECORATION                                                       */}
      {/* =============================================================== */}

      <View style={styles.featuredGlowOne} />

      <View style={styles.featuredGlowTwo} />

      {/* =============================================================== */}
      {/* TOP                                                             */}
      {/* =============================================================== */}

      <View style={styles.featuredTop}>
        <View style={styles.featuredDate}>
          <Text style={styles.featuredDateDay}>{formatDateBadgeDay(appointment.start_datetime)}</Text>

          <Text style={styles.featuredDateMonth}>{formatDateBadgeMonth(appointment.start_datetime)}</Text>
        </View>

        <View style={styles.featuredState}>
          <View
            style={[
              styles.featuredStateDot,
              {
                backgroundColor: state.color,
              },
            ]}
          />

          <Text style={styles.featuredStateText}>{state.label}</Text>
        </View>
      </View>

      {/* =============================================================== */}
      {/* BODY                                                            */}
      {/* =============================================================== */}

      <View style={styles.featuredBody}>
        <Text style={styles.featuredTime}>{formatTimeRange(appointment.start_datetime, appointment.end_datetime)}</Text>

        <Text style={styles.featuredReason} numberOfLines={2}>
          {reason}
        </Text>

        <View style={styles.featuredDentistRow}>
          <FontAwesome name="user-md" size={13} color="rgba(255,255,255,0.72)" />

          <Text style={styles.featuredDentist} numberOfLines={1}>
            {dentist}
          </Text>
        </View>
      </View>

      {/* =============================================================== */}
      {/* FOOTER                                                          */}
      {/* =============================================================== */}

      <View style={styles.featuredFooter}>
        <View style={styles.featuredRelative}>
          <FontAwesome name="clock-o" size={12} color="#FFFFFF" />

          <Text style={styles.featuredRelativeText}>{relative}</Text>
        </View>

        <View style={styles.featuredDetails}>
          <Text style={styles.featuredDetailsText}>Ver detalles</Text>

          <FontAwesome name="chevron-right" size={10} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
