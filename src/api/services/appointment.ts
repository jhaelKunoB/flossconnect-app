import { api } from "@/api/client";
import { Appointment, AppointmentSlot, CreateAppointment } from "@/types/appointment";

export const getAppointmentsByPatient = async (idClinic: number, idPatient: number, role?: string): Promise<Appointment[]> => {
  const { data: res } = await api.post(`/dev/appointment/role`, {
    idClinic,
    idPatient,
    role,
  });
  return res.data || [];
};

export const getSlotsByDentistAndDate = async (idDentist: number, date: string): Promise<AppointmentSlot[]> => {
  const { data: res } = await api.post(`/dev/appointment/slots`, {
    idDentist,
    date,
  });
  return res.data || [];
};

export const createAppointment = async (appointmentData: CreateAppointment): Promise<void> => {
  const { data: res } = await api.post(`/dev/appointment/create`, appointmentData);
  return res.data;
};

/* ========================================================================== */
/*                        UPDATE APPOINTMENT STATE                            */
/* ========================================================================== */

type UpdateAppointmentStateOptions = {
  cancelReason?: string | null;
  idUserAction?: number | null;
};

export const updateAppointmentState = async (
  idAppointment: string | number,
  newState: string,
  options: UpdateAppointmentStateOptions = {},
): Promise<Appointment> => {
  const { data: res } = await api.put("/dev/appointment/updateStatus", {
    idAppointment: Number(idAppointment),
    newState,
    cancelReason: options.cancelReason ?? null,
    idUserAction: options.idUserAction ?? null,
  });

  console.log("📅 Estado de la cita actualizado:", res);

  return res.data;
};
