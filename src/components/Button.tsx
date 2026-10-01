import { useSemanticColors } from "@/hooks/useSemanticColors";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface ButtonProps {
  icon?: React.ReactNode;
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "outline";
}

const Button: React.FC<ButtonProps> = ({ icon, title, onPress, disabled = false, loading = false, style, textStyle, variant = "primary" }) => {
  const c = useSemanticColors();

  const variantMap = {
    primary: {
      bg: c.primary,
      text: c.primaryContrast,
      border: c.primary,
      pressedBg: withOpacity(c.primary, 0.9),
    },
    secondary: {
      bg: c.secondary,
      text: c.secondaryContrast,
      border: c.border,
      pressedBg: withOpacity(c.secondary, 0.95),
    },
    outline: {
      bg: "transparent",
      text: c.primary,
      border: c.primary,
      pressedBg: withOpacity(c.primary, 0.08),
    },
  } as const;

  const v = variantMap[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? v.pressedBg : v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && <Text style={[styles.text, { color: v.text }, textStyle]}>{title}</Text>}
        </View>
      )}
    </Pressable>
  );
};

function withOpacity(hex: string, alpha: number) {
  // hex #RRGGBB -> rgba
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    maxWidth: 320,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  iconContainer: {
    marginRight: 8, // Space between icon and text
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
