import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";

import { Ionicons } from "@expo/vector-icons";

import React from "react";

import { Pressable, StyleSheet, View } from "react-native";

import { formatBolivianos } from "../lib/formatters";

type Props = {
  balance: number;

  onPress?: () => void;
};

export function PaymentStatusCard({ balance, onPress }: Props) {
  const c = useSemanticColors();

  const hasDebt = balance > 0;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,

        {
          backgroundColor: c.surface,

          borderColor: c.border,

          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: hasDebt ? "rgba(245,158,11,0.10)" : "rgba(16,185,129,0.10)",
          },
        ]}
      >
        <Ionicons name={hasDebt ? "wallet-outline" : "checkmark-circle-outline"} size={20} color={hasDebt ? c.warning : c.success} />
      </View>

      <View style={styles.content}>
        <ThemedText
          type="default"
          style={[
            styles.label,
            {
              color: c.textSecondary,
            },
          ]}
        >
          {hasDebt ? "Saldo pendiente" : "Estado de pagos"}
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.amount,
            {
              color: hasDebt ? c.textPrimary : c.success,
            },
          ]}
        >
          {hasDebt ? formatBolivianos(balance) : "Pagos al día"}
        </ThemedText>
      </View>

      {onPress && <Ionicons name="chevron-forward" size={16} color={c.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,

    borderWidth: 1,

    borderRadius: 16,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 13,

    paddingVertical: 11,
  },

  icon: {
    width: 40,

    height: 40,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: 9,

    marginBottom: 2,
  },

  amount: {
    fontSize: 16,

    fontWeight: "700",
  },
});
