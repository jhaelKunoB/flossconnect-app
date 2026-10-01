import { api } from "@/api/client";
import { Department } from "@/types/department";

export async function getDepartments(): Promise<Department[]> {
  try {
    const { data: res } = await api.get("/dev/departments");
    //console.log("getDepartments response:", res.data);
    return res.data || [];
  } catch (error: any) {
    console.error("Error getting departments:", error);
    throw error;
  }
}
