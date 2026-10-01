// components/ui/IOSAlert.tsx
import { useSemanticColors } from "@/hooks/useSemanticColors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef } from "react";
import { Animated, ColorValue, Easing, Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Variant = "success" | "warning" | "error" | "info";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  variant?: Variant;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onRequestClose?: () => void;
};

const VARIANT_COLORS: Record<Variant, string> = {
  success: "#16a34a",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#0ea5e9",
};

const VARIANT_ICONS: Record<Variant, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  success: "check-circle",
  warning: "warning-amber",
  error: "error-outline",
  info: "info-outline",
};

export default function ModalMessage({
  visible,
  title,
  message,
  variant = "info",
  primaryText = "OK",
  secondaryText,
  onPrimary,
  onSecondary,
  onRequestClose,
}: Props) {
  const c = useSemanticColors();
  const scheme = useColorScheme();

  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.96);
    }
  }, [visible]);

  const accent = VARIANT_COLORS[variant];
  const iconName = VARIANT_ICONS[variant];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onRequestClose} />
      </Animated.View>

      {/* Card */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }],
              backgroundColor: c.surface,
              borderColor: c.border,
            },
          ]}
        >
          {/* Icono */}
          <View style={[styles.iconWrap, { backgroundColor: c.surfaceAlt }]}>
            <MaterialIcons name={iconName} size={22} color={accent as ColorValue} />
          </View>

          {!!title && (
            <Text style={[styles.title, { color: c.textPrimary }]} numberOfLines={2}>
              {title}
            </Text>
          )}

          {!!message && (
            <Text style={[styles.message, { color: c.textSecondary }]} numberOfLines={6}>
              {message}
            </Text>
          )}

          {/* Acciones estilo iOS: centradas, sin fondo, con separadores */}
          <View style={[styles.actionsBar, { borderTopColor: c.border }]}>
            {secondaryText ? (
              <>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={onSecondary}>
                  <Text style={[styles.actionText, { color: c.primary }]}>{secondaryText}</Text>
                </TouchableOpacity>

                <View style={[styles.vDivider, { backgroundColor: c.border }]} />

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={onPrimary}>
                  <Text style={[styles.actionText, { color: c.primary, fontWeight: "800" }]}>{primaryText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={onPrimary}>
                <Text style={[styles.actionText, { color: c.primary, fontWeight: "800" }]}>{primaryText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const BUTTON_HEIGHT = 44;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  centerWrap: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0, // el bar de acciones ya tiene su propio alto
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrap: {
    alignSelf: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 18,
  },

  // --- acciones estilo iOS ---
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
    marginHorizontal: -16, // extender a los bordes de la card
    height: BUTTON_HEIGHT,
  },
  vDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    height: "100%",
  },
  actionBtn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
