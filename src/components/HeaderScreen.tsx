// components/Header.tsx
import { useSemanticColors } from "@/hooks/useSemanticColors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, showBackButton = true, rightComponent, backgroundColor, titleColor, style }) => {
  const c = useSemanticColors();
  const insets = useSafeAreaInsets();

  const bg = backgroundColor ?? c.surface;
  const text = titleColor ?? c.textPrimary;

  const BASE_HEIGHT = 56;
  const padTop = Platform.OS === "ios" ? Math.max(1, insets.top ? 0 : 6) : (StatusBar.currentHeight ?? 0) > 0 ? 5 : 6;

  // 👇 alineación dinámica del centro
  const centerAlignItems = showBackButton ? "center" : "flex-start";
  const titleTextAlign = showBackButton ? "center" : "left";

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: bg }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: bg,
            paddingTop: padTop,
            height: BASE_HEIGHT + padTop,
          },
          style,
        ]}
      >
        {/* IZQUIERDA: back opcional */}
        {showBackButton ? (
          <TouchableOpacity style={styles.sideBtn} onPress={onBack} activeOpacity={0.7} accessibilityLabel="Volver atrás">
            <MaterialIcons name="arrow-back-ios-new" size={22} color={text} />
          </TouchableOpacity>
        ) : (
          // cuando NO hay back, no reservamos espacio extra
          <View style={{ width: 5, height: 40 }} />
        )}

        {/* CENTRO: título */}
        <View style={[styles.center, { alignItems: centerAlignItems }]} pointerEvents="box-none">
          {!!title && (
            <Text numberOfLines={1} style={[styles.title, { color: text, textAlign: titleTextAlign }]}>
              {title}
            </Text>
          )}
        </View>

        {/* DERECHA: componente opcional */}
        {rightComponent ? <View style={styles.sideBtn}>{rightComponent}</View> : <View style={styles.sideBtn} />}
      </View>

      {/* Separador inferior sutil */}
      <View style={[styles.separator, { backgroundColor: c.border }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  sideBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  separator: {
    height: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
    opacity: Platform.OS === "ios" ? 0.6 : 1,
  },
});

export default Header;
