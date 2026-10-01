import { ThemedText } from "@/components/themed-text";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import { PatientHomePromotion } from "@/types/home";

import { Ionicons } from "@expo/vector-icons";

import React, { forwardRef } from "react";

import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

import { formatPromotionDate, formatPromotionDiscount } from "../lib/formatters";

type Props = {
  promotion: PatientHomePromotion | null;
  onSchedule: (promotion: PatientHomePromotion) => void;
};

/* ========================================================================== */
/*                           PROMOTION DETAILS                                */
/* ========================================================================== */

export const PromotionDetailsSheet = forwardRef<ActionSheetRef, Props>(({ promotion, onSchedule }, ref) => {
  const c = useSemanticColors();

  if (!promotion) {
    return null;
  }

  return (
    <ActionSheet
      ref={ref}
      gestureEnabled
      containerStyle={{
        backgroundColor: c.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      
      indicatorStyle={{
        backgroundColor: c.border,
        width: 42,
      }}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* =========================================================== */}
        {/* HEADER                                                      */}
        {/* =========================================================== */}

        <View style={styles.header}>
          <View
            style={[
              styles.mainIcon,
              {
                backgroundColor: c.surfaceAlt,
              },
            ]}
          >
            <Ionicons name="pricetag" size={23} color={c.primary} />
          </View>

          <View style={styles.headerContent}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.eyebrow,
                {
                  color: c.primary,
                },
              ]}
            >
              PROMOCIÓN
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.title}>
              {promotion.name}
            </ThemedText>
          </View>
        </View>

        {/* =========================================================== */}
        {/* DISCOUNT                                                    */}
        {/* =========================================================== */}

        <View
          style={[
            styles.discountBox,
            {
              backgroundColor: c.surfaceAlt,

              borderColor: c.border,
            },
          ]}
        >
          <ThemedText
            type="default"
            style={[
              styles.discountLabel,
              {
                color: c.textSecondary,
              },
            ]}
          >
            Beneficio
          </ThemedText>

          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.discountValue,
              {
                color: c.primary,
              },
            ]}
          >
            {formatPromotionDiscount(promotion)}
          </ThemedText>
        </View>

        {/* =========================================================== */}
        {/* DESCRIPTION                                                 */}
        {/* =========================================================== */}

        {promotion.description && (
          <View style={styles.block}>
            <ThemedText type="defaultSemiBold" style={styles.blockTitle}>
              Sobre esta promoción
            </ThemedText>

            <ThemedText
              type="default"
              style={[
                styles.description,
                {
                  color: c.textSecondary,
                },
              ]}
            >
              {promotion.description}
            </ThemedText>
          </View>
        )}

        {/* =========================================================== */}
        {/* VALIDITY                                                    */}
        {/* =========================================================== */}

        <View style={styles.block}>
          <ThemedText type="defaultSemiBold" style={styles.blockTitle}>
            Vigencia
          </ThemedText>

          <View
            style={[
              styles.infoRow,
              {
                backgroundColor: c.surfaceAlt,
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={17} color={c.primary} />

            <View
              style={{
                flex: 1,
              }}
            >
              <ThemedText
                type="default"
                style={[
                  styles.infoLabel,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                Disponible desde
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.infoValue}>
                {formatPromotionDate(promotion.startDate)}
              </ThemedText>
            </View>

            <Ionicons name="arrow-forward" size={14} color={c.textMuted} />

            <View
              style={{
                flex: 1,
              }}
            >
              <ThemedText
                type="default"
                style={[
                  styles.infoLabel,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                Hasta
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.infoValue}>
                {formatPromotionDate(promotion.endDate)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* =========================================================== */}
        {/* PROCEDURES                                                  */}
        {/* =========================================================== */}

        <View style={styles.block}>
          <ThemedText type="defaultSemiBold" style={styles.blockTitle}>
            ¿A qué aplica?
          </ThemedText>

          {promotion.appliesToAll ? (
            <View
              style={[
                styles.allProcedures,
                {
                  backgroundColor: c.surfaceAlt,
                },
              ]}
            >
              <View
                style={[
                  styles.smallIcon,
                  {
                    backgroundColor: c.surface,
                  },
                ]}
              >
                <Ionicons name="medical" size={16} color={c.primary} />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.procedureName}>
                  Todos los procedimientos elegibles
                </ThemedText>

                <ThemedText
                  type="default"
                  style={[
                    styles.procedureDescription,
                    {
                      color: c.textSecondary,
                    },
                  ]}
                >
                  La promoción puede aplicarse a cualquier procedimiento permitido por la clínica.
                </ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.procedureList}>
              {promotion.procedures.map((procedure) => (
                <View
                  key={procedure.id}
                  style={[
                    styles.procedureItem,
                    {
                      borderColor: c.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.smallIcon,
                      {
                        backgroundColor: c.surfaceAlt,
                      },
                    ]}
                  >
                    <Ionicons name="medical-outline" size={15} color={c.primary} />
                  </View>

                  <View style={styles.procedureContent}>
                    <ThemedText type="defaultSemiBold" style={styles.procedureName}>
                      {procedure.name}
                    </ThemedText>

                    {procedure.description && (
                      <ThemedText
                        type="default"
                        style={[
                          styles.procedureDescription,
                          {
                            color: c.textSecondary,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {procedure.description}
                      </ThemedText>
                    )}

                    {procedure.code && (
                      <ThemedText
                        type="default"
                        style={[
                          styles.procedureCode,
                          {
                            color: c.textMuted,
                          },
                        ]}
                      >
                        {procedure.code}
                      </ThemedText>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* =========================================================== */}
        {/* CLINICAL NOTICE                                             */}
        {/* =========================================================== */}

        <View
          style={[
            styles.notice,
            {
              backgroundColor: c.surfaceAlt,
            },
          ]}
        >
          <Ionicons name="information-circle-outline" size={18} color={c.primary} />

          <ThemedText
            type="default"
            style={[
              styles.noticeText,
              {
                color: c.textSecondary,
              },
            ]}
          >
            Puedes agendar utilizando esta promoción. El procedimiento definitivo será determinado por el odontólogo durante tu atención.
          </ThemedText>
        </View>

        {/* =========================================================== */}
        {/* CTA                                                         */}
        {/* =========================================================== */}

        <Pressable
          onPress={() => onSchedule(promotion)}
          style={[
            styles.primaryButton,
            {
              backgroundColor: c.primary,
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={17} color={c.primaryContrast} />

          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.primaryButtonText,
              {
                color: c.primaryContrast,
              },
            ]}
          >
            Agendar con promoción
          </ThemedText>
        </Pressable>

        <View
          style={{
            height: 12,
          }}
        />
      </ScrollView>
    </ActionSheet>
  );
});

PromotionDetailsSheet.displayName = "PromotionDetailsSheet";

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,

    paddingTop: 10,

    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 17,
  },

  mainIcon: {
    width: 46,

    height: 46,

    borderRadius: 14,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 11,
  },

  headerContent: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 8,

    fontWeight: "800",

    letterSpacing: 1,

    marginBottom: 2,
  },

  title: {
    fontSize: 18,

    lineHeight: 23,

    fontWeight: "700",
  },

  discountBox: {
    borderWidth: 1,

    borderRadius: 16,

    padding: 14,

    marginBottom: 20,
  },

  discountLabel: {
    fontSize: 9,

    marginBottom: 3,
  },

  discountValue: {
    fontSize: 20,

    fontWeight: "800",
  },

  block: {
    marginBottom: 20,
  },

  blockTitle: {
    fontSize: 12,

    fontWeight: "700",

    marginBottom: 8,
  },

  description: {
    fontSize: 11,

    lineHeight: 17,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 9,

    borderRadius: 14,

    padding: 12,
  },

  infoLabel: {
    fontSize: 8,

    marginBottom: 2,
  },

  infoValue: {
    fontSize: 10,

    fontWeight: "700",
  },

  allProcedures: {
    flexDirection: "row",

    alignItems: "center",

    borderRadius: 14,

    padding: 11,
  },

  procedureList: {
    gap: 8,
  },

  procedureItem: {
    borderWidth: 1,

    borderRadius: 14,

    padding: 10,

    flexDirection: "row",

    alignItems: "flex-start",
  },

  smallIcon: {
    width: 34,

    height: 34,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 9,
  },

  procedureContent: {
    flex: 1,
  },

  procedureName: {
    fontSize: 10,

    fontWeight: "700",
  },

  procedureDescription: {
    marginTop: 2,

    fontSize: 9,

    lineHeight: 13,
  },

  procedureCode: {
    fontSize: 8,

    marginTop: 3,
  },

  notice: {
    flexDirection: "row",

    alignItems: "flex-start",

    gap: 8,

    padding: 11,

    borderRadius: 13,

    marginBottom: 18,
  },

  noticeText: {
    flex: 1,

    fontSize: 9,

    lineHeight: 14,
  },

  primaryButton: {
    minHeight: 48,

    borderRadius: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,
  },

  primaryButtonText: {
    fontSize: 11,

    fontWeight: "700",
  },
});
