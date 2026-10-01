import FontAwesome from "@expo/vector-icons/FontAwesome";

import React from "react";

import { Text, View } from "react-native";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import { styles } from "../styles";

type Props = {
  upcoming: number;

  attended: number;

  cancelled: number;
};

type SummaryItemProps = {
  icon: React.ComponentProps<typeof FontAwesome>["name"];

  value: number;

  label: string;

  color: string;

  bg: string;

  showDivider?: boolean;
};

function SummaryItem({ icon, value, label, color, bg, showDivider = true }: SummaryItemProps) {
  const t = useSemanticColors();

  return (
    <>
      <View style={styles.summaryItem}>
        <View
          style={[
            styles.summaryIcon,
            {
              backgroundColor: bg,
            },
          ]}
        >
          <FontAwesome name={icon} size={13} color={color} />
        </View>

        <Text
          style={[
            styles.summaryValue,
            {
              color: t.textPrimary,
            },
          ]}
        >
          {value}
        </Text>

        <Text
          style={[
            styles.summaryLabel,
            {
              color: t.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {showDivider && (
        <View
          style={[
            styles.summaryDivider,
            {
              backgroundColor: t.border,
            },
          ]}
        />
      )}
    </>
  );
}

export default function AppointmentsSummary({ upcoming, attended, cancelled }: Props) {
  const t = useSemanticColors();

  return (
    <View
      style={[
        styles.summaryContainer,
        {
          backgroundColor: t.surface,

          borderColor: t.border,
        },
      ]}
    >
      <SummaryItem icon="calendar-o" value={upcoming} label="Próximas" color={t.primary} bg="rgba(0,84,130,0.10)" />

      <SummaryItem icon="check-circle" value={attended} label="Atendidas" color={t.success} bg="rgba(29,185,84,0.10)" />

      <SummaryItem icon="times-circle" value={cancelled} label="Canceladas" color={t.danger} bg="rgba(239,68,68,0.10)" showDivider={false} />
    </View>
  );
}
