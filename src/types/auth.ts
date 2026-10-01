import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;





//Para el login de pacientes

export type PatientClinic = {
  id: number;
  name: string;
};

export type PatientUser = {
  id: number;
  email: string;
  role: "Paciente";

  firstname?: string | null;
  lastname?: string | null;
  photo?: string | null;
  clinic?: PatientClinic | null;
};

export type PatientAuthResponse = {
  accessToken: string;
  user: PatientUser;
};