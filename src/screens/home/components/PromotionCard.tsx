import { ThemedText } from "@/components/themed-text";
import { useSemanticColors } from "@/hooks/useSemanticColors";
import { PatientHomePromotion } from "@/types/home";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { formatPromotionDiscountShort, formatPromotionShortDate } from "../lib/formatters";

type Props = {
  promotion: PatientHomePromotion;
  onPress: () => void;
};

export function PromotionCard({ promotion, onPress }: Props) {
  const c = useSemanticColors();

  const procedureCount = promotion.procedures.length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: c.surface,
          borderColor: c.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      {/* =============================================================== */}
      {/* TOP                                                             */}
      {/* =============================================================== */}

      <View style={styles.top}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Ionicons name="pricetag-outline" size={18} color={c.primary} />
        </View>

        <View
          style={[
            styles.discountBadge,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.discount,
              {
                color: c.primary,
              },
            ]}
          >
            {formatPromotionDiscountShort(promotion)}
          </ThemedText>
        </View>
      </View>

      {/* =============================================================== */}
      {/* CONTENT                                                         */}
      {/* =============================================================== */}

      <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
        {promotion.name}
      </ThemedText>

      {promotion.description && (
        <ThemedText
          type="default"
          style={[
            styles.description,
            {
              color: c.textSecondary,
            },
          ]}
          numberOfLines={2}
        >
          {promotion.description}
        </ThemedText>
      )}

      {/* =============================================================== */}
      {/* META                                                            */}
      {/* =============================================================== */}

      <View style={styles.meta}>
        <Ionicons name="calendar-outline" size={12} color={c.textMuted} />

        <ThemedText
          type="default"
          style={[
            styles.metaText,
            {
              color: c.textMuted,
            },
          ]}
        >
          Hasta {formatPromotionShortDate(promotion.endDate)}
        </ThemedText>
      </View>

      <View style={styles.meta}>
        <Ionicons name="medical-outline" size={12} color={c.textMuted} />

        <ThemedText
          type="default"
          style={[
            styles.metaText,
            {
              color: c.textMuted,
            },
          ]}
          numberOfLines={1}
        >
          {promotion.appliesToAll ? "Todos los procedimientos" : procedureCount === 1 ? "1 procedimiento" : `${procedureCount} procedimientos`}
        </ThemedText>
      </View>

      {/* =============================================================== */}
      {/* FOOTER                                                          */}
      {/* =============================================================== */}

      <View style={styles.footer}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.footerText,
            {
              color: c.primary,
            },
          ]}
        >
          Ver promoción
        </ThemedText>

        <Ionicons name="arrow-forward" size={13} color={c.primary} />
      </View>
    </Pressable>
  );
}





const styles = StyleSheet.create({
  card: {
    width: 230,

    minHeight: 190,

    borderWidth: 1,

    borderRadius: 18,

    padding: 14,
  },

  top: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 12,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  discountBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  discount: {
    fontSize: 9,
    fontWeight: "800",
  },

  title: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },

  description: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
    minHeight: 28,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },

  metaText: {
    flex: 1,
    fontSize: 8,
  },

  footer: {
    marginTop: "auto",
    paddingTop: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  footerText: {
    fontSize: 9,

    fontWeight: "700",
  },
});
