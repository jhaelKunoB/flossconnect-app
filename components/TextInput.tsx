import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useSemanticColors } from "@/hooks/useSemanticColors";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: React.ReactNode; // ← Nuevo: acepta cualquier componente
}

const TextInput: React.FC<Props> = ({
  label,
  error,
  style,
  containerStyle,
  labelStyle,
  disabled = false,
  editable,
  onFocus,
  onBlur,
  leftIcon, // ← Nuevo
  ...rest
}) => {
  const c = useSemanticColors();
  const [focused, setFocused] = useState(false);

  const resolvedEditable = editable ?? !disabled;

  const borderColor = error
    ? c.danger
    : focused
    ? c.primary
    : c.border;

  const bgColor = resolvedEditable ? c.surface : c.surfaceAlt;
  const textColor = c.textPrimary;
  const placeholderColor = c.textMuted;
  const errorColor = c.danger;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle, { color: error ? errorColor : c.textMuted }]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: bgColor,
          },
        ]}
      >
        {/* Icono izquierdo opcional */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}

        <RNTextInput
          {...rest}
          editable={resolvedEditable}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={placeholderColor as string}
          style={[
            styles.input,
            {
              color: textColor,
              opacity: resolvedEditable ? 1 : 0.7,
              paddingLeft: leftIcon ? 0 : 12, // Sin padding si hay icono
            },
            style,
          ]}
        />
      </View>

      {error ? (
        <Text style={[styles.error, { color: errorColor }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  leftIconContainer: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextInput;