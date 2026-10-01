import { api } from "@/api/client";

import { PatientResponse, RegisterPatientRequest } from "@/types/patient";

export async function createPatient(patientData: RegisterPatientRequest): Promise<PatientResponse> {
  try {
    const { data: res } = await api.post("/dev/createPatient", patientData);
    console.log("createPatient response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error creating patient:", error);
    throw error;
  }
}
