
export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export type PatientStatus = 'Stable' | 'Critical' | 'Discharged' | 'In Treatment';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  status: PatientStatus;
  room: string;
  admissionDate: string;
  condition: string;
  doctor: string;
  history: MedicalRecord[];
}

export interface MedicalRecord {
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  availability: string;
  image: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'patient' | 'system';
  read: boolean;
}
