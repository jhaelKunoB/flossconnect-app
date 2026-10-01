import { useSemanticColors } from "@/hooks/useSemanticColors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface StepHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  numStep: number;
  totalSteps?: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ icon, title, subtitle, numStep, totalSteps = 4 }) => {
  const c = useSemanticColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [icon, title, subtitle]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.iconCircle, { backgroundColor: c.primary + "15" }]}>
        <Ionicons name={icon} size={28} color={c.primary} />
      </View>

      <Text style={[styles.title, { color: c.textPrimary }]}>{title}</Text>

      <Text style={[styles.subtitle, { color: c.textSecondary }]}>{subtitle}</Text>

      <View style={styles.stepper}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <View key={s} style={[styles.stepDot, { backgroundColor: s <= numStep ? c.primary : c.border }]} />
        ))}
      </View>
    </Animated.View>
  );
};

const ICON_SIZE = 56;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
    opacity: 0.75,
    marginBottom: 12,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  stepDot: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
});

export default StepHeader;
