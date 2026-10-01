import {Department} from './department';
import { Specialty } from './speciality';
export type Clinic = {
  id: number;
  name: string;
  address: string;
  logo?: string | null;
  nit?: string | null;
  latitude: string;
  longitude: string;
  phone?: string | null;
  status: string;
  registerDate: string;
  lastUpdate?: string | null; 
  department?: Department;
  specialities?: Specialty[];
};