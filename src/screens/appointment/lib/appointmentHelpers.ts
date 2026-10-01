import { Appointment, AppointmentSlot } from "@/types/appointment";
import { PatientHomePromotion } from "@/types/home";

/* ========================================================================== */
/*                            STATE CONFIG                                    */
/* ========================================================================== */

export type StateKey = "Programada" | "En atención" | "Atendida" | "Cancelada" | "No asistió" | "Reprogramada" | "Vencida";

export type StateConfig = {
  label: string;

  color: string;

  icon: string;

  bg: string;
};

const HEX = {
  amber: "#F59E0B",

  blue: "#005482",

  green: "#10B981",

  red: "#EF4444",

  slate: "#94A3B8",

  violet: "#8B5CF6",
};

export const STATE_CONFIG: Record<string, StateConfig> = {
  Programada: {
    label: "Programada",
    color: HEX.blue,
    icon: "calendar-o",
    bg: "rgba(0,84,130,0.10)",
  },

  "En atención": {
    label: "En atención",
    color: HEX.amber,
    icon: "hourglass-half",
    bg: "rgba(245,158,11,0.12)",
  },

  Atendida: {
    label: "Atendida",
    color: HEX.green,
    icon: "check-circle",
    bg: "rgba(16,185,129,0.12)",
  },

  Cancelada: {
    label: "Cancelada",
    color: HEX.red,
    icon: "times-circle",
    bg: "rgba(239,68,68,0.12)",
  },

  "No asistió": {
    label: "No asistió",
    color: HEX.slate,
    icon: "user-times",
    bg: "rgba(148,163,184,0.14)",
  },

  Reprogramada: {
    label: "Reprogramada",
    color: HEX.violet,
    icon: "refresh",
    bg: "rgba(139,92,246,0.12)",
  },

  Vencida: {
    label: "Vencida",
    color: HEX.slate,
    icon: "clock-o",
    bg: "rgba(148,163,184,0.14)",
  },

  /* ----------------------------------------------------------------------- */
  /* LEGACY                                                                  */
  /* ----------------------------------------------------------------------- */

  "1": {
    label: "Programada",
    color: HEX.blue,
    icon: "calendar-o",
    bg: "rgba(0,84,130,0.10)",
  },

  "2": {
    label: "Atendida",
    color: HEX.green,
    icon: "check-circle",
    bg: "rgba(16,185,129,0.12)",
  },

  "3": {
    label: "Cancelada",
    color: HEX.red,
    icon: "times-circle",
    bg: "rgba(239,68,68,0.12)",
  },
};

export function getStateConfig(state: string): StateConfig {
  return (
    STATE_CONFIG[state] ?? {
      label: state || "Estado",

      color: HEX.slate,

      icon: "circle",

      bg: "rgba(148,163,184,0.12)",
    }
  );
}

/* ========================================================================== */
/*                      VISUAL APPOINTMENT STATE                              */
/* ========================================================================== */

export function getAppointmentVisualState(appointment: Appointment): string {
  const state = appointment.state;

  /**
   * Una cita que quedó Programada pero cuya fecha ya pasó
   * se considera visualmente "Vencida".
   *
   * NO modificamos el estado de la base de datos.
   */
  if ((state === "Programada" || state === "1") && !isFuture(appointment.start_datetime)) {
    return "Vencida";
  }

  return state;
}

export function getAppointmentStateConfig(appointment: Appointment): StateConfig {
  return getStateConfig(getAppointmentVisualState(appointment));
}

/* ========================================================================== */
/*                           APPOINTMENT CATEGORY                             */
/* ========================================================================== */

export function isUpcomingAppointment(appointment: Appointment): boolean {
  if (appointment.state === "En atención") {
    return true;
  }

  const stateIsScheduled = appointment.state === "Programada" || appointment.state === "1";

  return stateIsScheduled && isFuture(appointment.start_datetime);
}

/* ========================================================================== */
/*                            DATE HELPERS                                    */
/* ========================================================================== */

export function isFuture(iso: string): boolean {
  return new Date(iso).getTime() > Date.now();
}

export function isToday(iso: string): boolean {
  const date = new Date(iso);

  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

export function isTomorrow(iso: string): boolean {
  const date = new Date(iso);

  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate();
}

/**
 * Importante:
 * ya no usamos iso.split("T")[0]
 * porque eso agrupa por fecha UTC.
 *
 * Convertimos primero a hora local.
 */
export function getDateKey(iso: string): string {
  const date = new Date(iso);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatHeaderDate(iso: string): string {
  if (isToday(iso)) {
    return "Hoy";
  }

  if (isTomorrow(iso)) {
    return "Mañana";
  }

  const date = new Date(iso);

  const weekday = date.toLocaleDateString("es-BO", {
    weekday: "long",
  });

  const day = date.getDate();

  const month = date.toLocaleDateString("es-BO", {
    month: "long",
  });

  return `${capitalize(weekday)} ${day} de ${capitalize(month)}`;
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-BO", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",
  });
}

export function formatDateLong(iso: string): string {
  const date = new Date(iso);

  const weekday = date.toLocaleDateString("es-BO", {
    weekday: "long",
  });

  const month = date.toLocaleDateString("es-BO", {
    month: "long",
  });

  const currentYear = new Date().getFullYear();

  const showYear = date.getFullYear() !== currentYear;

  return `${capitalize(weekday)} ${date.getDate()} de ${month}${showYear ? ` de ${date.getFullYear()}` : ""}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-BO", {
    hour: "2-digit",

    minute: "2-digit",

    hour12: false,
  });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

export function formatDuration(startIso: string, endIso: string): string {
  const start = new Date(startIso).getTime();

  const end = new Date(endIso).getTime();

  const diffMin = Math.max(0, Math.round((end - start) / 60000));

  const hours = Math.floor(diffMin / 60);

  const minutes = diffMin % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} h ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} h`;
  }

  return `${minutes} min`;
}

export function formatDateTime(iso: string): string {
  return `${formatDateShort(iso)} · ${formatTime(iso)}`;
}

/* ========================================================================== */
/*                            DATE BADGE                                      */
/* ========================================================================== */

export function formatDateBadgeDay(iso: string): string {
  return String(new Date(iso).getDate()).padStart(2, "0");
}

export function formatDateBadgeMonth(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("es-BO", {
      month: "short",
    })
    .replace(".", "")
    .toUpperCase();
}

/* ========================================================================== */
/*                           RELATIVE LABEL                                   */
/* ========================================================================== */

export function getRelativeAppointmentLabel(iso: string): string {
  if (isToday(iso)) {
    return "Hoy";
  }

  if (isTomorrow(iso)) {
    return "Mañana";
  }

  const target = new Date(iso);

  const now = new Date();

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffDays = Math.round((startTarget.getTime() - startToday.getTime()) / 86400000);

  if (diffDays > 1 && diffDays <= 7) {
    return `En ${diffDays} días`;
  }

  return formatDateLong(iso);
}

/* ========================================================================== */
/*                            MISC HELPERS                                    */
/* ========================================================================== */

export function capitalize(value: string): string {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDentistFullName(appointment: Appointment): string {
  const fullName = [appointment.dentistName, appointment.dentistLastName].filter(Boolean).join(" ").trim();

  return fullName || "Odontólogo no asignado";
}

export function getReasonShort(appointment: Appointment): string {
  return appointment.reason?.trim() || "Consulta odontológica";
}

/* ========================================================================== */
/*                              SUMMARY                                      */
/* ========================================================================== */

export type AppointmentsSummary = {
  upcoming: number;

  attended: number;

  cancelled: number;

  total: number;
};

export function buildSummary(appointments: Appointment[]): AppointmentsSummary {
  let upcoming = 0;

  let attended = 0;

  let cancelled = 0;

  for (const appointment of appointments) {
    if (appointment.state === "Atendida" || appointment.state === "2") {
      attended++;

      continue;
    }

    if (appointment.state === "Cancelada" || appointment.state === "3") {
      cancelled++;

      continue;
    }

    if (isUpcomingAppointment(appointment)) {
      upcoming++;
    }
  }

  return {
    upcoming,

    attended,

    cancelled,

    total: appointments.length,
  };
}


















//----------------------------------------------------------
/* ========================================================================== */
/*                          PROMOTION HELPERS                                 */
/* ========================================================================== */

const CLINIC_TIME_ZONE =
  "America/La_Paz";

/* -------------------------------------------------------------------------- */
/*                        CLINIC LOCAL DATE KEY                               */
/* -------------------------------------------------------------------------- */

export  const getClinicDateKeyFromIso = (
  value: string,
): string => {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          CLINIC_TIME_ZONE,

        year: "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      },
    ).formatToParts(
      date,
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        "year",
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        "month",
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        "day",
    )?.value;

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

/* -------------------------------------------------------------------------- */
/*                         FORMAT PROMOTION DATE                              */
/* -------------------------------------------------------------------------- */

export const formatPromotionDate = (
  value: string,
): string => {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "es-BO",
    {
      day: "numeric",

      month: "long",

      year: "numeric",

      timeZone:
        CLINIC_TIME_ZONE,
    },
  );
};

/* -------------------------------------------------------------------------- */
/*                       FORMAT PROMOTION DISCOUNT                            */
/* -------------------------------------------------------------------------- */

export const formatPromotionDiscount = (
  promotion: PatientHomePromotion,
): string => {
  if (
    promotion.discountType ===
    "percentage"
  ) {
    return `${promotion.discountValue}% de descuento`;
  }

  return `Bs ${promotion.discountValue.toFixed(
    2,
  )} de descuento`;
};

/* -------------------------------------------------------------------------- */
/*                          SLOT INSIDE PROMOTION                             */
/* -------------------------------------------------------------------------- */

export const isSlotInsidePromotion = (
  slot: AppointmentSlot,
  promotion:
    | PatientHomePromotion
    | null,
): boolean => {
  if (
    !promotion
  ) {
    return true;
  }

  const slotStart =
    new Date(
      slot.startDatetime,
    ).getTime();

  const slotEnd =
    new Date(
      slot.endDatetime,
    ).getTime();

  const promotionStart =
    new Date(
      promotion.startDate,
    ).getTime();

  const promotionEnd =
    new Date(
      promotion.endDate,
    ).getTime();

  if (
    Number.isNaN(
      slotStart,
    ) ||
    Number.isNaN(
      slotEnd,
    ) ||
    Number.isNaN(
      promotionStart,
    ) ||
    Number.isNaN(
      promotionEnd,
    )
  ) {
    return false;
  }

  return (
    slotStart >=
      promotionStart &&
    slotEnd <=
      promotionEnd
  );
};