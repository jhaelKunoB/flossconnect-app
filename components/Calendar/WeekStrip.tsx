// components/CalendarCom/WeekStrip.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useSemanticColors } from "@/hooks/useSemanticColors";

type Props = {
  style?: ViewStyle;
  onSelect?: (d: Date) => void;
  daysAheadCount?: number;
  /** Incluir hoy (false = empieza en mañana). Default: false */
  includeToday?: boolean;
};

const DIAS_ABREV = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

function addDays(d: Date, n: number) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}
function sameYMD(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}
function formatFullEs(d: Date) {
  const nombreDia = [
    "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"
  ][d.getDay()];
  const dd = d.getDate();
  const mes = MESES[d.getMonth()];
  const yyyy = d.getFullYear();
  return `${nombreDia}, ${dd} de ${mes} ${yyyy}`;
}

const WeekStrip: React.FC<Props> = ({
  style,
  onSelect,
  daysAheadCount = 5,
  includeToday = true,
}) => {
  const today = new Date();
  const startOffset = includeToday ? 0 : 1; // 0 = incluye hoy, 1 = desde mañana
  const days = useMemo(() => {
    return Array.from({ length: daysAheadCount }, (_, i) =>
      addDays(today, startOffset + i)
    );
  }, [today, startOffset, daysAheadCount]);

  const [selected, setSelected] = useState<Date>(days[0]);
  const fullTitle = useMemo(() => formatFullEs(selected), [selected]);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Título grande */}
      <Text style={styles.fullTitle}>{fullTitle}</Text>

      {/* Tira de próximos días */}
      <View style={styles.row}>
        {days.map((d) => {
          const isSelected = sameYMD(d, selected);
          const isToday = sameYMD(d, today); 
          return (
            <TouchableOpacity
              key={d.toDateString()}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.8}
              onPress={() => {
                setSelected(d);
                onSelect?.(d);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ${d.toDateString()}`}
            >
              <Text
                style={[
                  styles.dayAbbr,
                  isSelected ? styles.textSelected : isToday ? styles.textToday : null,
                ]}
              >
                {DIAS_ABREV[d.getDay()]}
              </Text>

              <View style={[styles.divider, isSelected && styles.dividerSelected]} />

              <Text style={[styles.dayNum, isSelected ? styles.textSelected : undefined]}>
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  fullTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    borderColor: "#33637aff",
    borderWidth:0.5
    //shadow
     
  },
  cardSelected: {
    backgroundColor: "#1f364aff",
  },
  dayAbbr: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  divider: {
    width: "70%",
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 6,
  },
  dividerSelected: {
    backgroundColor: "#9CA3AF",
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  textSelected: {
    color: "#FFFFFF",
  },
  textToday: {
    color: "#10B981",
  },
});

export default WeekStrip;
