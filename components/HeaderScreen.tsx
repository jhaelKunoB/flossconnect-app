// components/Header.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSemanticColors } from "@/hooks/useSemanticColors";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  rightComponent,
  backgroundColor,
  titleColor,
  style,
}) => {
  const c = useSemanticColors();
  const insets = useSafeAreaInsets();

  const bg = backgroundColor ?? c.surface;
  const text = titleColor ?? c.textPrimary;

  // Altura base (sin incluir safe area)
  const BASE_HEIGHT = 56;
  // Padding top respetando notch/estatus bar en ambas plataformas
  const padTop =
    Platform.OS === "ios" ? Math.max(1, insets.top ? 0 : 6) // SafeAreaView ya añade el área del notch
      : (StatusBar.currentHeight ?? 0) > 0
      ? 5
      : 6;

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
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Volver atrás"
          >
            <MaterialIcons name="arrow-back-ios-new" size={22} color={text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideBtn} />
        )}

        {/* CENTRO: título */}
        <View style={styles.center} pointerEvents="box-none">
          {!!title && (
            <Text numberOfLines={1} style={[styles.title, { color: text }]}>
              {title}
            </Text>
          )}
        </View>

        {/* DERECHA: componente opcional */}
        {rightComponent ? (
          <View style={styles.sideBtn}>{rightComponent}</View>
        ) : (
          <View style={styles.sideBtn} />
        )}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  separator: {
    height: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
    opacity: Platform.OS === "ios" ? 0.6 : 1,
  },
});

export default Header;
