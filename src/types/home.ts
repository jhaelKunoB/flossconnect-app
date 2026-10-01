/* ========================================================================== */
/*                    TIPOS DEL HOME MÓVIL DE PACIENTE                        */
/* ========================================================================== */

/* ========================================================================== */
/*                              ODONTÓLOGO                                    */
/* ========================================================================== */

export interface PatientHomeDentist {
  name: string | null;
}

/* ========================================================================== */
/*                              PRÓXIMA CITA                                  */
/* ========================================================================== */

export interface PatientHomeAppointment {
  id: number;

  startDatetime: string;

  endDatetime: string;

  reason: string | null;

  dentist: PatientHomeDentist;
}

/* ========================================================================== */
/*                         TRATAMIENTO ACTUAL                                 */
/* ========================================================================== */

export interface PatientHomeTreatment {
  id: number;

  name: string;

  status: string;

  totalProcedures: number;

  completedProcedures: number;

  nextProcedure: string | null;

  nextDate: string | null;
}

/* ========================================================================== */
/*                              PAGOS                                         */
/* ========================================================================== */

export interface PatientHomePayments {
  pendingBalance: number;
}

/* ========================================================================== */
/*                         NOTIFICACIONES                                     */
/* ========================================================================== */

export interface PatientHomeNotifications {
  unreadCount: number;
}

/* ========================================================================== */
/*                         ÚLTIMA ATENCIÓN                                    */
/* ========================================================================== */

export interface PatientHomeLastAttention {
  id: number;

  procedure: string | null;

  date: string;

  dentist: PatientHomeDentist;
}

/* ========================================================================== */
/*                            PROMOCIONES                                     */
/* ========================================================================== */

export type PatientHomePromotionDiscountType =
  | "percentage"
  | "fixed";

export type PatientHomePromotionProcedureScope =
  | "diente_individual"
  | "varios_dientes"
  | "boca_completa"
  | "general";

export interface PatientHomePromotionProcedure {
  id: number;

  name: string;

  code: string | null;

  description: string | null;

  scope: PatientHomePromotionProcedureScope;

  basePrice: number;
}

export interface PatientHomePromotion {
  id: number;

  name: string;

  description: string | null;

  discountType: PatientHomePromotionDiscountType;

  discountValue: number;

  appliesToAll: boolean;

  startDate: string;

  endDate: string;

  /**
   * Por ahora conservamos la key.
   *
   * Cuando resolvamos imágenes de S3
   * agregaremos imageUrl.
   */
  imageKey: string | null;

  procedures: PatientHomePromotionProcedure[];
}

/* ========================================================================== */
/*                         HOME DEL PACIENTE                                  */
/* ========================================================================== */

export interface PatientMobileHome {
  nextAppointment: PatientHomeAppointment | null;

  treatment: PatientHomeTreatment | null;

  payments: PatientHomePayments;

  notifications: PatientHomeNotifications;

  lastAttention: PatientHomeLastAttention | null;

  promotions: PatientHomePromotion[];
}