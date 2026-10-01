import FontAwesome from "@expo/vector-icons/FontAwesome";

import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useSemanticColors } from "@/hooks/useSemanticColors";

import { styles } from "../styles";

type Variant = "no-appointments" | "no-upcoming" | "no-more-upcoming" | "no-filtered";

type Props = {
  onSchedule: () => void;

  variant?: Variant;
};

type Content = {
  title: string;

  description: string;

  showButton: boolean;
};

const CONTENT: Record<Variant, Content> = {
  "no-appointments": {
    title: "Aún no tienes citas",

    description: "Agenda tu primera atención. Tus próximas citas y tu historial aparecerán aquí.",

    showButton: true,
  },

  "no-upcoming": {
    title: "No tienes citas próximas",

    description: "Cuando necesites una nueva atención puedes agendarla desde aquí.",

    showButton: true,
  },

  "no-more-upcoming": {
    title: "No tienes más citas próximas",

    description: "Tu siguiente cita ya aparece destacada arriba.",

    showButton: false,
  },

  "no-filtered": {
    title: "No hay citas para mostrar",

    description: "No encontramos citas que coincidan con esta sección.",

    showButton: false,
  },
};

export default function EmptyAppointments({ onSchedule, variant = "no-appointments" }: Props) {
  const t = useSemanticColors();

  const content = CONTENT[variant];

  return (
    <View
      style={[
        styles.emptyContainer,
        {
          backgroundColor: t.surface,

          borderColor: t.border,
        },
      ]}
    >
      <View
        style={[
          styles.emptyIcon,
          {
            backgroundColor: t.surfaceAlt,
          },
        ]}
      >
        <FontAwesome name="calendar-o" size={25} color={t.primary} />
      </View>

      <Text
        style={[
          styles.emptyTitle,
          {
            color: t.textPrimary,
          },
        ]}
      >
        {content.title}
      </Text>

      <Text
        style={[
          styles.emptyDescription,
          {
            color: t.textSecondary,
          },
        ]}
      >
        {content.description}
      </Text>

      {content.showButton && (
        <TouchableOpacity
          style={[
            styles.emptyButton,
            {
              backgroundColor: t.primary,
            },
          ]}
          activeOpacity={0.85}
          onPress={onSchedule}
        >
          <FontAwesome name="calendar-plus-o" size={13} color={t.primaryContrast} />

          <Text
            style={[
              styles.emptyButtonText,
              {
                color: t.primaryContrast,
              },
            ]}
          >
            Agendar cita
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
