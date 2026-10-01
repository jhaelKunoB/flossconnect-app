import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Lineicons } from "@lineiconshq/react-native-lineicons";
import {
  Home2Outlined,
  CalendarDaysOutlined,
  User4Outlined,
  Island2Outlined,
  ChevronLeftOutlined,
  Code1Outlined,
  ClipboardOutlined,
} from "@lineiconshq/free-icons";

export type IconSymbolName =
  | "house.fill"
  | "calendar"
  | "person"
  | "paperplane.fill"
  | "chevron.right"
  | "chevron.left.forwardslash.chevron.right"
  | "treatment"
  | "appointment.new";

const ICON_MAP: Record<IconSymbolName, any> = {
  "house.fill": Home2Outlined,
  "calendar": CalendarDaysOutlined,
  "person": User4Outlined,
  "paperplane.fill": Island2Outlined,
  "chevron.right": ChevronLeftOutlined,
  "chevron.left.forwardslash.chevron.right": Code1Outlined,
  'treatment': ClipboardOutlined,
  'appointment.new': CalendarDaysOutlined
};

type Props = {
  name: IconSymbolName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({
  name,
  size = 24,
  color = "#222",
  strokeWidth = 2,
  style,
}: Props) {
  const icon = ICON_MAP[name] ?? Home2Outlined; // fallback seguro

  return (
    <Lineicons
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}
