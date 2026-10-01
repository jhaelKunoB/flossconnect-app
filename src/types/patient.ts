export type RegisterPatientRequest = {
  firstName: string;
  firstLastName: string;
  secondLastName?: string;
  ci: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  gender: string;
  departmentId: number;
  email: string;
  password: string;
  clinicId: number;
  clinicName?: string;
};


export type PatientResponse = {
  id: number;
  email: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  ci: string;
  clinic: {
    id: number;
    name?: string;
  };
};