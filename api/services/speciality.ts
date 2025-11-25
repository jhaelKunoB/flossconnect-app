import { api } from '@/api/client';
import { Specialty } from '@/types/speciality';


export async function getSpecialitys(): Promise<Specialty[]> {
    try {
        const {data: res} = await api.get('/dev/speciality');
        //console.log("getSpecialitys response:", res.data);
        return res.data || [];
    } catch (error: any) {
        console.error("Error getting specialities:", error);
        throw error;
    }
}