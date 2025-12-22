
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor, User, UserRole } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

interface RegisterPayload extends Omit<User, 'id'> {
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  specialty?: string;
  experience?: string;
}

interface HospitalContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  login: (email: string, password: string) => boolean;
  register: (payload: RegisterPayload) => void;
  logout: () => void;
  // User Management
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Medical Entities
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
  resetData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'healsync_users_v7',
  AUTH: 'healsync_auth_v7',
  PATIENTS: 'healsync_patients_v7',
  APPOINTMENTS: 'healsync_appointments_v7',
  DOCTORS: 'healsync_doctors_v7'
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
    const user = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (payload: RegisterPayload) => {
    const id = `U${Math.random().toString(36).substr(2, 9)}`;
    const { email, name, password, role, ...extra } = payload;
    
    const newUser: User = { id, email, name, password, role };
    setUsers(prev => [...prev, newUser]);
    
    if (role === 'doctor') {
      const newDoc: Doctor = {
        id: `D${Math.floor(1000 + Math.random() * 9000)}`,
        name: name,
        specialty: extra.specialty || 'General Physician',
        experience: extra.experience || '1 Year',
        availability: 'Mon - Fri',
        image: `https://picsum.photos/seed/${id}/200/200`
      };
      setDoctors(prev => [...prev, newDoc]);
    } else if (role === 'patient') {
      const newPatient: Patient = {
        id: `P${Math.floor(1000 + Math.random() * 9000)}`,
        name: name,
        age: extra.age || 0,
        gender: extra.gender || 'Other',
        bloodGroup: extra.bloodGroup || 'O+',
        status: 'Stable',
        room: 'Unassigned',
        admissionDate: new Date().toISOString().split('T')[0],
        condition: 'Newly Registered',
        doctor: 'Unassigned',
        history: []
      };
      setPatients(prev => [...prev, newPatient]);
    }
    
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  // Core User management (The "Backend" Logic)
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) logout();
  };

  const addPatient = (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      history: []
    };
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (updates.name) {
      setAppointments(prev => prev.map(a => a.patientId === id ? { ...a, patientName: updates.name! } : a));
      // Also update the linked user record if it exists
      const linkedUser = users.find(u => u.name === patients.find(p => p.id === id)?.name);
      if (linkedUser) updateUser(linkedUser.id, { name: updates.name });
    }
  };

  const deletePatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    // Remove the associated login account
    if (patient) {
      const linkedUser = users.find(u => u.name === patient.name && u.role === 'patient');
      if (linkedUser) deleteUser(linkedUser.id);
    }
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

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    const oldName = doctors.find(d => d.id === id)?.name;
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    if (updates.name) {
      setAppointments(prev => prev.map(a => a.doctorName === oldName ? { ...a, doctorName: updates.name! } : a));
      const linkedUser = users.find(u => u.name === oldName && u.role === 'doctor');
      if (linkedUser) updateUser(linkedUser.id, { name: updates.name });
    }
  };

  const deleteDoctor = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    setDoctors(prev => prev.filter(d => d.id !== id));
    // Remove associated login account
    if (doctor) {
      const linkedUser = users.find(u => u.name === doctor.name && u.role === 'doctor');
      if (linkedUser) deleteUser(linkedUser.id);
    }
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const resetData = () => {
    localStorage.clear();
    setPatients(MOCK_PATIENTS);
    setAppointments(MOCK_APPOINTMENTS);
    setDoctors(MOCK_DOCTORS);
    setUsers(DEFAULT_USERS);
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <HospitalContext.Provider value={{ 
      currentUser, users, patients, appointments, doctors, 
      login, register, logout,
      updateUser, deleteUser,
      addPatient, updatePatient, deletePatient, 
      addAppointment, deleteAppointment,
      addDoctor, updateDoctor, deleteDoctor,
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
