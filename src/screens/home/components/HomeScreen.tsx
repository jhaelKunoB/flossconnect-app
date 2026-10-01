// components/HeaderGreeting.tsx

import { useSemanticColors } from "@/hooks/useSemanticColors";

import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useMemo } from "react";

import { Image, ImageSourcePropType, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

/* ========================================================================== */
/*                                   PROPS                                    */
/* ========================================================================== */

type Props = {
  avatar?:
    | ImageSourcePropType
    | {
        uri: string;
      }
    | null;

  name: string;

  clinicName?: string | null;

  onPressBell?: () => void;

  style?: StyleProp<ViewStyle>;

  badgeCount?: number;

  greetingIcon?: React.ReactNode;
};

/* ========================================================================== */
/*                                 GREETING                                   */
/* ========================================================================== */

function getGreeting(): "Buenos días" | "Buenas tardes" | "Buenas noches" {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Buenos días";
  }

  if (hour < 19) {
    return "Buenas tardes";
  }

  return "Buenas noches";
}

/* ========================================================================== */
/*                                INITIALS                                    */
/* ========================================================================== */

function getInitials(name: string): string {
  const clean = name.trim();

  if (!clean) {
    return "?";
  }

  const parts = clean.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ========================================================================== */
/*                              VALID AVATAR                                  */
/* ========================================================================== */

function hasValidAvatar(
  avatar?:
    | ImageSourcePropType
    | {
        uri: string;
      }
    | null,
): avatar is
  | ImageSourcePropType
  | {
      uri: string;
    } {
  if (!avatar) {
    return false;
  }

  if (typeof avatar === "object" && "uri" in avatar) {
    const uri = (
      avatar as {
        uri?: string;
      }
    ).uri;

    return typeof uri === "string" && uri.trim().length > 0;
  }

  return typeof avatar === "number";
}

/* ========================================================================== */
/*                                  CONFIG                                    */
/* ========================================================================== */

const AVATAR_SIZE = 42;

/* ========================================================================== */
/*                              COMPONENT                                     */
/* ========================================================================== */

export default function HeaderGreeting({ avatar, name, clinicName, onPressBell, style, badgeCount = 0, greetingIcon }: Props) {
  const c = useSemanticColors();

  const greeting = getGreeting();

  const showImage = hasValidAvatar(avatar);

  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.safeArea,
        {
          backgroundColor: c.backdrop,
        },
      ]}
    >
      <View style={[styles.container, style]}>
        {/* =============================================================== */}
        {/* LEFT                                                            */}
        {/* =============================================================== */}

        <View style={styles.left}>
          {/* ------------------------------------------------------------- */}
          {/* AVATAR                                                        */}
          {/* ------------------------------------------------------------- */}

          {showImage ? (
            <Image
              source={avatar as ImageSourcePropType}
              style={[
                styles.avatar,
                {
                  borderColor: c.border,

                  backgroundColor: c.surfaceAlt,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarFallback,
                {
                  backgroundColor: c.primary,

                  borderColor: c.primary,
                },
              ]}
            >
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TEXT                                                          */}
          {/* ------------------------------------------------------------- */}

          <View style={styles.textContent}>
            <View style={styles.greetingRow}>
              <Text
                style={[
                  styles.greeting,
                  {
                    color: c.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {greeting}
              </Text>

              {greetingIcon ?? <Text style={styles.handEmoji}>👋</Text>}
            </View>

            <Text
              style={[
                styles.name,
                {
                  color: c.textPrimary,
                },
              ]}
              numberOfLines={1}
            >
              {name}
            </Text>

            {!!clinicName && (
              <View style={styles.clinicRow}>
                <Ionicons name="location-outline" size={11} color={c.textMuted} />

                <Text
                  style={[
                    styles.clinicName,
                    {
                      color: c.textMuted,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {clinicName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* =============================================================== */}
        {/* NOTIFICATIONS                                                   */}
        {/* =============================================================== */}

        <Pressable
          onPress={onPressBell}
          disabled={!onPressBell}
          accessibilityRole="button"
          accessibilityLabel="Notificaciones"
          hitSlop={8}
          style={({ pressed }) => [
            styles.bellButton,

            {
              backgroundColor: c.surface,

              borderColor: c.border,

              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name="notifications-outline" size={20} color={c.textPrimary} />

          {badgeCount > 0 && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: c.danger,
                },
              ]}
            >
              <Text style={styles.badgeText}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ========================================================================== */
/*                                  STYLES                                    */
/* ========================================================================== */

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },

  container: {
    minHeight: 72,

    paddingHorizontal: 16,

    paddingVertical: 10,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  /* ---------------------------------------------------------------------- */
  /* LEFT                                                                   */
  /* ---------------------------------------------------------------------- */

  left: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",

    alignItems: "center",

    paddingRight: 12,
  },

  /* ---------------------------------------------------------------------- */
  /* AVATAR                                                                 */
  /* ---------------------------------------------------------------------- */

  avatar: {
    width: AVATAR_SIZE,

    height: AVATAR_SIZE,

    borderRadius: AVATAR_SIZE / 2,

    borderWidth: 1,

    marginRight: 11,
  },

  avatarFallback: {
    alignItems: "center",

    justifyContent: "center",
  },

  initials: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "700",

    letterSpacing: 0.4,
  },

  /* ---------------------------------------------------------------------- */
  /* TEXT                                                                   */
  /* ---------------------------------------------------------------------- */

  textContent: {
    flex: 1,

    minWidth: 0,
  },

  greetingRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  greeting: {
    fontSize: 10,

    fontWeight: "500",
  },

  handEmoji: {
    fontSize: 11,
  },

  name: {
    marginTop: 1,

    fontSize: 16,

    lineHeight: 20,

    fontWeight: "700",
  },

  clinicRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    marginTop: 2,
  },

  clinicName: {
    flexShrink: 1,

    fontSize: 9,

    lineHeight: 12,
  },

  /* ---------------------------------------------------------------------- */
  /* NOTIFICATION                                                          */
  /* ---------------------------------------------------------------------- */

  bellButton: {
    width: 38,

    height: 38,

    borderRadius: 12,

    borderWidth: 1,

    alignItems: "center",

    justifyContent: "center",

    position: "relative",
  },

  badge: {
    position: "absolute",

    right: -4,

    top: -4,

    minWidth: 17,

    height: 17,

    borderRadius: 9,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 3,

    borderWidth: 2,

    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFFFFF",

    fontSize: 8,

    fontWeight: "800",
  },
});
