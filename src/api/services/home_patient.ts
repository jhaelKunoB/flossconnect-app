import { api } from "@/api/client";
import { PatientMobileHome } from "@/types/home";
/* ========================================================================== */
/*                    TIPOS DEL HOME MÓVIL DE PACIENTE                        */
/* ========================================================================== */

//Es nesesario enviar el token
export async function getPatientHome(): Promise<PatientMobileHome> {
  try {
    const { data: res } = await api.get(`/dev/mobile/patient/home`);

    console.log("Patient home response:", res);
    return res.data;
  } catch (error: any) {
    console.error("Error getting patient home:", error);
    throw error;
  }
}
