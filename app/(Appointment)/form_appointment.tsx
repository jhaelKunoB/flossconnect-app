import { createAppointment } from "@/api/services/appointment";
import { usePatientAuth } from "@/hooks/useAuth";
import FormAppointment from "@/screens/appointment/form/AppointmentForm";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { useMemo } from "react";

export default function AppointmentFormModal() {
  const router = useRouter();
  const { user } = usePatientAuth();

  const { promotionId: promotionIdParam } = useLocalSearchParams<{ promotionId?: string;}>();
  
  const promotionId = useMemo(() => {
    if (!promotionIdParam) {
      return null;
    }
    const value = Number(promotionIdParam);
    return Number.isInteger(value) && value > 0 ? value : null;
  }, [promotionIdParam]);

  const handleSubmit = async (data: Parameters<typeof createAppointment>[0]) => {
    try {
      await createAppointment(data);
      router.back();
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      Alert.alert("No se pudo agendar", "Intenta nuevamente.");
      throw error;
    }
  };

  if (!user?.id || !user.clinic?.id) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FormAppointment clinicId={user.clinic.id} patientId={user.id} onSubmit={handleSubmit} promotionId={promotionId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
