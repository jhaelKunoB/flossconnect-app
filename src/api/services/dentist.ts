import { api } from "@/api/client";
import { Dentist } from "@/types/dentist";

export async function getDentistByClinic(clinicId: number): Promise<Dentist[]> {
  try {
    const { data: res } = await api.get(`/dev/dentist/${clinicId}`);

    console.log("getDentistByClinic response:", res.data);  
    return res.data || [];
  } catch (error: any) {
    console.error("Error getting departments:", error);
    throw error;
  }
}
