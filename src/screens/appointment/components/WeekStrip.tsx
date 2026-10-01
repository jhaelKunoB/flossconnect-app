// components/Calendar/WeekStrip.tsx

import { useSemanticColors } from "@/hooks/useSemanticColors";

import React, { useMemo } from "react";

import { ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

/* ========================================================================== */
/*                                   TYPES                                    */
/* ========================================================================== */

type Props = {
  style?: StyleProp<ViewStyle>;

  onSelect?: (date: Date) => void;

  /**
   * Fecha seleccionada desde el formulario.
   */
  selectedDate?: Date | null;

  /**
   * Cantidad máxima de días a mostrar.
   */
  daysAheadCount?: number;

  /**
   * true:
   * puede incluir hoy.
   *
   * false:
   * comienza mañana.
   */
  includeToday?: boolean;

  /**
   * Primera fecha permitida.
   *
   * Útil para promociones.
   */
  minDate?: Date | null;

  /**
   * Última fecha permitida.
   *
   * Útil para promociones.
   */
  maxDate?: Date | null;
};

/* ========================================================================== */
/*                                  CONSTANTS                                 */
/* ========================================================================== */

const DIAS_ABREV = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

/* ========================================================================== */
/*                                  HELPERS                                   */
/* ========================================================================== */

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
  const result = startOfDay(date);

  result.setDate(result.getDate() + amount);

  return result;
}

function sameYMD(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function compareDay(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

function formatFullEs(date: Date): string {
  const nombreDia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][date.getDay()];

  const day = date.getDate();

  const month = MESES[date.getMonth()];

  const year = date.getFullYear();

  return `${nombreDia}, ${day} de ${month} ${year}`;
}

/* ========================================================================== */
/*                                COMPONENT                                   */
/* ========================================================================== */

const WeekStrip: React.FC<Props> = ({
  style,
  onSelect,
  selectedDate = null,
  daysAheadCount = 30,
  includeToday = true,
  minDate = null,
  maxDate = null,
}) => {
  const c = useSemanticColors();

  const today = startOfDay(new Date());

  /* ------------------------------------------------------------------------ */
  /* START DATE                                                               */
  /* ------------------------------------------------------------------------ */

  const startDate = useMemo(() => {
    let start = includeToday ? today : addDays(today, 1);

    if (minDate && compareDay(minDate, start) > 0) {
      start = startOfDay(minDate);
    }

    return start;
  }, [includeToday, minDate, today.getTime()]);

  /* ------------------------------------------------------------------------ */
  /* DAYS                                                                     */
  /* ------------------------------------------------------------------------ */

  const days = useMemo(() => {
    const result: Date[] = [];

    for (let index = 0; index < daysAheadCount; index++) {
      const date = addDays(startDate, index);

      if (maxDate && compareDay(date, maxDate) > 0) {
        break;
      }

      result.push(date);
    }

    return result;
  }, [startDate, maxDate, daysAheadCount]);

  /* ------------------------------------------------------------------------ */
  /* TITLE                                                                    */
  /* ------------------------------------------------------------------------ */

  const fullTitle = useMemo(() => {
    if (selectedDate) {
      return formatFullEs(selectedDate);
    }

    return "Selecciona una fecha";
  }, [selectedDate]);

  /* ------------------------------------------------------------------------ */
  /* EMPTY                                                                    */
  /* ------------------------------------------------------------------------ */

  if (days.length === 0) {
    return (
      <View style={[styles.wrapper, style]}>
        <View
          style={[
            styles.empty,
            {
              backgroundColor: c.surfaceAlt,

              borderColor: c.border,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyTitle,
              {
                color: c.textPrimary,
              },
            ]}
          >
            No hay fechas disponibles
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: c.textSecondary,
              },
            ]}
          >
            No existen fechas disponibles dentro del período permitido.
          </Text>
        </View>
      </View>
    );
  }

  /* ======================================================================== */
  /* RENDER                                                                   */
  /* ======================================================================== */

  return (
    <View style={[styles.wrapper, style]}>
      <Text
        style={[
          styles.fullTitle,
          {
            color: c.textPrimary,
          },
        ]}
      >
        {fullTitle}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {days.map((date) => {
          const isSelected = selectedDate ? sameYMD(date, selectedDate) : false;

          const isToday = sameYMD(date, today);

          const backgroundColor = isSelected ? c.primary : c.surfaceAlt;

          const borderColor = isSelected ? c.primary : c.border;

          const dayTextColor = isSelected ? c.primaryContrast : isToday ? c.success : c.textPrimary;

          const numberColor = isSelected ? c.primaryContrast : c.textPrimary;

          return (
            <TouchableOpacity
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              style={[
                styles.card,
                {
                  backgroundColor,
                  borderColor,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                onSelect?.(date);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ${formatFullEs(date)}`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <Text
                style={[
                  styles.dayAbbr,
                  {
                    color: dayTextColor,
                  },
                ]}
              >
                {DIAS_ABREV[date.getDay()]}
              </Text>

              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isSelected ? c.primaryContrast : c.border,
                  },
                ]}
              />

              <Text
                style={[
                  styles.dayNum,
                  {
                    color: numberColor,
                  },
                ]}
              >
                {date.getDate()}
              </Text>

              {isToday && (
                <Text
                  style={[
                    styles.today,
                    {
                      color: isSelected ? c.primaryContrast : c.success,
                    },
                  ]}
                >
                  Hoy
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

/* ========================================================================== */
/*                                   STYLES                                   */
/* ========================================================================== */

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 5,
  },

  fullTitle: {
    fontSize: 14,

    lineHeight: 20,

    fontWeight: "700",

    marginBottom: 10,
  },

  row: {
    gap: 8,

    paddingRight: 14,
  },

  card: {
    width: 62,

    minHeight: 78,

    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 9,

    borderRadius: 15,

    borderWidth: 1,
  },

  dayAbbr: {
    fontSize: 9,

    fontWeight: "700",
  },

  divider: {
    width: 28,

    height: StyleSheet.hairlineWidth,

    marginVertical: 5,
  },

  dayNum: {
    fontSize: 17,

    lineHeight: 20,

    fontWeight: "800",
  },

  today: {
    marginTop: 2,

    fontSize: 7,

    fontWeight: "700",
  },

  empty: {
    borderWidth: 1,

    borderRadius: 13,

    paddingHorizontal: 12,

    paddingVertical: 11,
  },

  emptyTitle: {
    fontSize: 11,

    fontWeight: "700",
  },

  emptyText: {
    fontSize: 9,

    lineHeight: 14,

    marginTop: 2,
  },
});

export default WeekStrip;
