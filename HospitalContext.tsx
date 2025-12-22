
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor, User, UserRole } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

interface HospitalContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => void;
  deletePatient: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  deleteDoctor: (id: string) => void;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
  resetData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'healsync_users_v3',
  AUTH: 'healsync_auth_v3',
  PATIENTS: 'healsync_patients_v3',
  APPOINTMENTS: 'healsync_appointments_v3',
  DOCTORS: 'healsync_doctors_v3'
};

const DEFAULT_USERS: User[] = [
  { id: 'u1', email: 'admin@healsync.com', name: 'Super Admin', role: 'admin', password: 'password123' },
  { id: 'u2', email: 'doctor@healsync.com', name: 'Dr. Sarah Wilson', role: 'doctor', password: 'password123' },
  { id: 'u3', email: 'patient@healsync.com', name: 'John Doe', role: 'patient', password: 'password123' }
];

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return saved ? JSON.parse(saved) : MOCK_DOCTORS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [users, currentUser, patients, appointments, doctors]);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `U${Math.random().toString(36).substr(2, 9)}` };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser); // Auto-login after registration
  };

  const logout = () => setCurrentUser(null);

  const addPatient = (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      history: []
    };
    setPatients(prev => [...prev, patient]);
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
  };

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newApp,
      id: `A${Math.floor(1000 + Math.random() * 9000)}`
    };
    setAppointments(prev => [...prev, appointment]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addDoctor = (newDoc: Omit<Doctor, 'id'>) => {
    const doctor: Doctor = {
      ...newDoc,
      id: `D${Math.floor(1000 + Math.random() * 9000)}`
    };
    setDoctors(prev => [...prev, doctor]);
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const resetData = () => {
    setPatients(MOCK_PATIENTS);
    setAppointments(MOCK_APPOINTMENTS);
    setDoctors(MOCK_DOCTORS);
    setUsers(DEFAULT_USERS);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <HospitalContext.Provider value={{ 
      currentUser, users, patients, appointments, doctors, 
      login, register, logout,
      addPatient, deletePatient, 
      addAppointment, deleteAppointment,
      addDoctor, deleteDoctor,
      updatePatientStatus, resetData 
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital must be used within a HospitalProvider');
  return context;
};
