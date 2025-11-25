import {api} from '@/api/client';
import {Clinic} from '@/types/clinic';

export async function getClinics(): Promise<Clinic[]> {
    try {
        const {data: res} = await api.get('/dev/clinics');
        console.log("getClinics response:", res.data);
        return res.data || [];
    } catch (error: any) {
        console.error("Error getting clinics:", error);
        throw error;
    }
}


