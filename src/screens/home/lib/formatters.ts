import { PatientHomePromotion } from "@/types/home";

/* ========================================================================== */
/*                                  CONFIG                                    */
/* ========================================================================== */

const CLINIC_TIME_ZONE = "America/La_Paz";

/* ========================================================================== */
/*                                   DATE                                     */
/* ========================================================================== */

export function formatAppointmentDate(value: string): string {
  return new Date(value).toLocaleDateString("es-BO", {
    weekday: "long",

    day: "numeric",

    month: "long",

    timeZone: CLINIC_TIME_ZONE,
  });
}

/* ========================================================================== */
/*                                SHORT DATE                                  */
/* ========================================================================== */

export function formatShortDate(value: string): string {
  return new Date(value).toLocaleDateString("es-BO", {
    day: "numeric",

    month: "short",

    timeZone: CLINIC_TIME_ZONE,
  });
}

/* ========================================================================== */
/*                                   TIME                                     */
/* ========================================================================== */

export function formatAppointmentTime(value: string): string {
  return new Date(value).toLocaleTimeString("es-BO", {
    hour: "2-digit",

    minute: "2-digit",

    hour12: false,

    timeZone: CLINIC_TIME_ZONE,
  });
}

/* ========================================================================== */
/*                               TIME RANGE                                   */
/* ========================================================================== */

export function formatAppointmentTimeRange(start: string, end: string): string {
  return `${formatAppointmentTime(start)} – ${formatAppointmentTime(end)}`;
}

/* ========================================================================== */
/*                              RELATIVE DATE                                 */
/* ========================================================================== */

export function formatRelativeAppointmentDate(value: string): string {
  const appointment = new Date(value);

  const now = new Date();

  const appointmentKey = appointment.toLocaleDateString("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
  });

  const todayKey = now.toLocaleDateString("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
  });

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tomorrowKey = tomorrow.toLocaleDateString("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
  });

  if (appointmentKey === todayKey) {
    return "Hoy";
  }

  if (appointmentKey === tomorrowKey) {
    return "Mañana";
  }

  return appointment.toLocaleDateString("es-BO", {
    weekday: "short",

    day: "numeric",

    month: "short",

    timeZone: CLINIC_TIME_ZONE,
  });
}

/* ========================================================================== */
/*                                  MONEY                                     */
/* ========================================================================== */

export function formatBolivianos(amount: number): string {
  return `Bs ${amount.toFixed(2)}`;
}

/* ========================================================================== */
/*                              PROMOTION                                     */
/* ========================================================================== */

export function formatPromotionDiscount(promotion: PatientHomePromotion): string {
  if (promotion.discountType === "percentage") {
    return `${promotion.discountValue}% de descuento`;
  }

  return `Bs ${promotion.discountValue.toFixed(2)} de descuento`;
}

/* ========================================================================== */
/*                          PROMOTION SHORT DISCOUNT                          */
/* ========================================================================== */

export function formatPromotionDiscountShort(promotion: PatientHomePromotion): string {
  if (promotion.discountType === "percentage") {
    return `${promotion.discountValue}% OFF`;
  }

  return `- Bs ${promotion.discountValue.toFixed(2)}`;
}

/* ========================================================================== */
/*                             PROMOTION DATE                                 */
/* ========================================================================== */

export function formatPromotionDate(value: string): string {
  return new Date(value).toLocaleDateString("es-BO", {
    day: "numeric",

    month: "long",

    year: "numeric",

    timeZone: "America/La_Paz",
  });
}

/* ========================================================================== */
/*                         PROMOTION SHORT DATE                               */
/* ========================================================================== */

export function formatPromotionShortDate(value: string): string {
  return new Date(value).toLocaleDateString("es-BO", {
    day: "numeric",

    month: "short",

    timeZone: "America/La_Paz",
  });
}
