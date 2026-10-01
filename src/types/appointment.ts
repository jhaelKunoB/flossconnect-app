/* ========================================================================== */
/*                              APPOINTMENT TYPES                             */
/* ========================================================================== */

/**
 * Estados actuales manejados por el backend.
 *
 * También mantenemos "1", "2" y "3"
 * temporalmente por compatibilidad con estados legacy.
 */
export type AppointmentState =
  | "Programada"
  | "En atención"
  | "Atendida"
  | "Cancelada"
  | "No asistió"
  | "Reprogramada"
  | "1"
  | "2"
  | "3";


/* ========================================================================== */
/*                                APPOINTMENT                                 */
/* ========================================================================== */

export type Appointment = {
  /**
   * PostgreSQL puede devolver BIGINT como string.
   *
   * Ejemplo actual del backend:
   * "id": "71"
   */
  id: string;

  /* ----------------------------------------------------------------------- */
  /* CITA                                                                    */
  /* ----------------------------------------------------------------------- */

  start_datetime: string;

  end_datetime: string;

  state: AppointmentState;

  reason: string | null;

  /* ----------------------------------------------------------------------- */
  /* PACIENTE                                                                */
  /* ----------------------------------------------------------------------- */

  patientId: number;

  patientName: string;

  patientLastName: string;

  patientPhone: string | null;

  /* ----------------------------------------------------------------------- */
  /* ODONTÓLOGO                                                              */
  /* ----------------------------------------------------------------------- */

  dentistId: number;

  dentistName: string;

  dentistLastName: string;

  /* ----------------------------------------------------------------------- */
  /* REGISTRO / AUDITORÍA                                                    */
  /* ----------------------------------------------------------------------- */

  register_date: string;

  /**
   * Última modificación de la cita.
   */
  last_update: string | null;

  /**
   * Usuario que realizó la última acción.
   *
   * Puede ser administrador, odontólogo,
   * paciente, etc. dependiendo del flujo.
   */
  id_user_action: number | null;

  /* ----------------------------------------------------------------------- */
  /* ATENCIÓN                                                                */
  /* ----------------------------------------------------------------------- */

  /**
   * Fecha/hora en la que comenzó la atención.
   */
  started_at: string | null;

  /**
   * Fecha/hora en la que la cita fue marcada como atendida.
   */
  attended_at: string | null;

  /* ----------------------------------------------------------------------- */
  /* CANCELACIÓN                                                             */
  /* ----------------------------------------------------------------------- */

  /**
   * Motivo por el cual se canceló la cita.
   */
  cancel_reason: string | null;

  /**
   * Fecha/hora de cancelación.
   */
  cancelled_at: string | null;

  /* ----------------------------------------------------------------------- */
  /* REPROGRAMACIÓN                                                          */
  /* ----------------------------------------------------------------------- */

  /**
   * ID de la cita anterior cuando esta cita
   * fue creada mediante una reprogramación.
   *
   * También viene como BIGINT/string desde PostgreSQL.
   */
  rescheduled_from_id: string | null;
};


/* ========================================================================== */
/*                              APPOINTMENT SLOT                              */
/* ========================================================================== */

export type AppointmentSlot = {
  /**
   * Fecha/hora ISO completa.
   *
   * Ej:
   * 2026-09-25T21:00:00.000Z
   */
  startDatetime: string;

  /**
   * Fecha/hora ISO completa de finalización.
   */
  endDatetime: string;

  /**
   * Hora de inicio en formato HH:mm.
   *
   * Ej:
   * 17:00
   */
  startHHMM: string;

  /**
   * Hora de finalización en formato HH:mm.
   *
   * Ej:
   * 17:30
   */
  endHHMM: string;

  /**
   * true  -> horario ocupado
   * false -> horario disponible
   */
  isBusy: boolean;
};


/* ========================================================================== */
/*                           CREATE APPOINTMENT                               */
/* ========================================================================== */

export type CreateAppointment = {
  id_clinic: number;

  id_patient: number;

  id_dentist: number;

  start_datetime: string;

  end_datetime: string;

  reason?: string;

  id_promotion_requested?: number | null;
};


/* ========================================================================== */
/*                          UPDATE APPOINTMENT STATE                          */
/* ========================================================================== */

/**
 * Por si luego lo utilizamos al cancelar,
 * reprogramar o cambiar el estado desde móvil.
 */
export type UpdateAppointmentState = {
  id: string;

  state: AppointmentState;

  cancel_reason?: string;
};


/* ========================================================================== */
/*                        APPOINTMENT RESCHEDULE                              */
/* ========================================================================== */

/**
 * Payload pensado para cuando implementemos
 * reprogramación desde la app móvil.
 */
export type RescheduleAppointment = {
  appointmentId: string;

  start_datetime: string;

  end_datetime: string;

  reason?: string;
};


/* ========================================================================== */
/*                            API RESPONSE                                    */
/* ========================================================================== */

/**
 * Estructura actual que devuelve el backend:
 *
 * {
 *   success: true,
 *   data: [...]
 * }
 */
export type AppointmentsResponse = {
  success: boolean;

  data: Appointment[];
};