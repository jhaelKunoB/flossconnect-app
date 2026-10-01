import { StyleSheet } from "react-native";

import Header from "@/components/HeaderScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TreatmentScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header showBackButton={false} title="Calendario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
