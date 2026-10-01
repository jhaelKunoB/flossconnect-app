import { getPatientHome } from "@/api/services/home_patient";

import Header from "@/screens/home/components/HomeScreen";

import { ThemedText } from "@/components/themed-text";

import { ThemedView } from "@/components/themed-view";

import { usePatientAuth } from "@/hooks/useAuth";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import { PatientMobileHome } from "@/types/home";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect, useRouter } from "expo-router";

import React, { useCallback, useState } from "react";

import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { HomeEmptyState } from "./components/HomeEmptyState";

import { HomeQuickActions } from "./components/HomeQuickActions";

import { HomeSectionHeader } from "./components/HomeSectionHeader";

import { LastAttentionCard } from "./components/LastAttentionCard";

import { NextAppointmentCard } from "./components/NextAppointmentCard";

import { PaymentStatusCard } from "./components/PaymentStatusCard";

import { TreatmentOverviewCard } from "./components/TreatmentOverviewCard";

import { PromotionsSection } from "./components/PromotionsSection";

/* ========================================================================== */
/*                                  HOME                                      */
/* ========================================================================== */

export default function HomeScreen() {
  const router = useRouter();

  const { user } = usePatientAuth();

  const c = useSemanticColors();

  const [homeData, setHomeData] = useState<PatientMobileHome | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadError, setLoadError] = useState(false);

  /* ====================================================================== */
  /* USER                                                                   */
  /* ====================================================================== */

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim();

  const displayName = fullName || "Paciente";

  const firstName = user?.firstname || displayName.split(" ")[0] || "Paciente";

  const clinicName = typeof user?.clinic?.name === "string" ? user.clinic.name : "Clínica Dental";

  /* ====================================================================== */
  /* LOAD                                                                   */
  /* ====================================================================== */

  const loadHome = useCallback(
    async (refresh = false) => {
      if (!user?.id) {
        setLoading(false);

        return;
      }

      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setLoadError(false);
        const data = await getPatientHome();

        setHomeData(data);
      } catch (error) {
        console.error("Error loading patient home:", error);

        setLoadError(true);
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    },
    [user?.id],
  );

  /* ---------------------------------------------------------------------- */
  /* REFRESH AL VOLVER AL HOME                                              */
  /* ---------------------------------------------------------------------- */

  useFocusEffect(
    useCallback(() => {
      void loadHome();
    }, [loadHome]),
  );

  /* ====================================================================== */
  /* DERIVED                                                                */
  /* ====================================================================== */

  const nextAppointment = homeData?.nextAppointment ?? null;

  const treatment = homeData?.treatment ?? null;

  const payments = homeData?.payments ?? null;

  const lastAttention = homeData?.lastAttention ?? null;

  const unreadNotifications = homeData?.notifications?.unreadCount ?? 0;

  const promotions = homeData?.promotions ?? [];
  /* ====================================================================== */
  /* LOADING                                                                */
  /* ====================================================================== */

  if (loading && !homeData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Ionicons name="medical-outline" size={25} color={c.primary} />
        </View>

        <ActivityIndicator size="small" color={c.primary} style={styles.loadingIndicator} />

        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.loadingText,
            {
              color: c.textSecondary,
            },
          ]}
        >
          Cargando tu información...
        </ThemedText>
      </ThemedView>
    );
  }

  /* ====================================================================== */
  /* RENDER                                                                 */
  /* ====================================================================== */

  return (
    <ThemedView style={styles.container}>
      {/* ================================================================= */}
      {/* HEADER                                                           */}
      {/* ================================================================= */}

      <Header
        avatar={
          user?.photo
            ? {
                uri: user.photo,
              }
            : undefined
        }
        name={displayName}
        clinicName={clinicName}
        badgeCount={unreadNotifications}
        onPressBell={() => {
          router.push("/(Notifications)/notifications");
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadHome(true)} tintColor={c.primary} />}
      >
        {/* =============================================================== */}
        {/* WELCOME                                                        */}
        {/* =============================================================== */}
        {/* 
        <View style={styles.welcome}>
          <ThemedText type="subtitle" style={styles.welcomeTitle}>
            Hola, {firstName} 👋
          </ThemedText>

          <ThemedText
            type="default"
            style={[
              styles.welcomeSubtitle,
              {
                color: c.textSecondary,
              },
            ]}
          >
            Esto es lo más importante de tu atención.
          </ThemedText>

          <View style={styles.clinicRow}>
            <Ionicons name="location-outline" size={13} color={c.textMuted} />

            <ThemedText
              type="default"
              style={[
                styles.clinicName,
                {
                  color: c.textMuted,
                },
              ]}
              numberOfLines={1}
            >
              {clinicName}
            </ThemedText>
          </View>
        </View> */}

        {/* =============================================================== */}
        {/* ERROR                                                          */}
        {/* =============================================================== */}

        {loadError && (
          <View style={styles.section}>
            <HomeEmptyState
              icon="cloud-offline-outline"
              title="No pudimos actualizar tu inicio"
              description="Revisa tu conexión e inténtalo nuevamente."
              action="Reintentar"
              onPress={() => loadHome()}
            />
          </View>
        )}

        {/* =============================================================== */}
        {/* QUICK ACTIONS                                                  */}
        {/* =============================================================== */}

        <HomeQuickActions
          actions={[
            {
              icon: "calendar-outline",
              label: "Agendar",
              onPress: () => router.push("/(Appointment)/form_appointment"),
            },

            {
              icon: "time-outline",

              label: "Mis citas",

              onPress: () => router.push("/(tabs)/appointments"),
            },

            {
              icon: "medical-outline",

              label: "Mi salud",

              onPress: () => router.push("/(tabs)/health"),
            },
          ]}
        />

        {/* =============================================================== */}
        {/* NEXT APPOINTMENT                                               */}
        {/* =============================================================== */}

        <View style={styles.section}>
          <HomeSectionHeader
            title="Próxima cita"
            action={nextAppointment ? "Ver todas" : undefined}
            onPress={nextAppointment ? () => router.push("/(tabs)/appointments") : undefined}
          />

          {nextAppointment ? (
            <NextAppointmentCard appointment={nextAppointment} onPress={() => router.push("/(tabs)/appointments")} />
          ) : (
            <HomeEmptyState
              icon="calendar-outline"
              title="No tienes citas próximas"
              description="Agenda una nueva atención cuando la necesites."
              action="Agendar"
              onPress={() => router.push("/(Appointment)/form_appointment")}
            />
          )}
        </View>

        {/* =============================================================== */}
        {/* PROMOTIONS                                                     */}
        {/* =============================================================== */}

        <PromotionsSection
          promotions={promotions}
          onSchedulePromotion={(promotion) => {
            router.push({
              pathname: "/(Appointment)/form_appointment",
              params: {         
                promotionId: String(promotion.id),
                promotionName: promotion.name,
              },
            });
          }}
        />

        {/* =============================================================== */}
        {/* TREATMENT                                                       */}
        {/* =============================================================== */}

        <View style={styles.section}>
          <HomeSectionHeader
            title="Mi tratamiento"
            action={treatment ? "Ver tratamiento" : undefined}
            onPress={treatment ? () => router.push("/(tabs)/health") : undefined}
          />

          {treatment ? (
            <TreatmentOverviewCard treatment={treatment} onPress={() => router.push("/(tabs)/health")} />
          ) : (
            <HomeEmptyState
              icon="medical-outline"
              title="Sin tratamiento activo"
              description="Cuando tu clínica registre un tratamiento, podrás seguir su progreso aquí."
            />
          )}
        </View>

        {/* =============================================================== */}
        {/* PAYMENTS                                                        */}
        {/* =============================================================== */}

        {payments && (
          <View style={styles.section}>
            <HomeSectionHeader title="Pagos" />

            <PaymentStatusCard balance={payments.pendingBalance} onPress={() => router.push("/(tabs)/health")} />
          </View>
        )}

        {/* =============================================================== */}
        {/* RECENT ACTIVITY                                                 */}
        {/* =============================================================== */}

        {lastAttention && (
          <View style={styles.section}>
            <HomeSectionHeader title="Actividad reciente" action="Ver mi salud" onPress={() => router.push("/(tabs)/health")} />

            <LastAttentionCard attention={lastAttention} onPress={() => router.push("/(tabs)/health")} />
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </ThemedView>
  );
}

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,

    paddingTop: 7,

    paddingBottom: 110,
  },

  loadingContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 54,

    height: 54,

    borderRadius: 17,

    alignItems: "center",

    justifyContent: "center",
  },

  loadingIndicator: {
    marginTop: 16,
  },

  loadingText: {
    marginTop: 9,

    fontSize: 11,
  },

  welcome: {
    marginBottom: 18,
  },

  welcomeTitle: {
    fontSize: 21,

    fontWeight: "700",
  },

  welcomeSubtitle: {
    fontSize: 11,

    lineHeight: 17,

    marginTop: 3,
  },

  clinicRow: {
    marginTop: 7,

    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  clinicName: {
    flexShrink: 1,

    fontSize: 9,
  },

  section: {
    marginBottom: 21,
  },

  bottomSpace: {
    height: 16,
  },
});
