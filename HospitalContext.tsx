
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor, User } from './types';
import { VirtualDB } from './BackendEngine';

interface HospitalContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
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

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const fetchAllData = async () => {
    const [u, p, a, d] = await Promise.all([
      VirtualDB.request<User[]>('GET', '/api/users'),
      VirtualDB.request<Patient[]>('GET', '/api/patients'),
      VirtualDB.request<Appointment[]>('GET', '/api/appointments'),
      VirtualDB.request<Doctor[]>('GET', '/api/doctors')
    ]);
    setUsers(u.data || []);
    setPatients(p.data || []);
    setAppointments(a.data || []);
    setDoctors(d.data || []);
  };

  useEffect(() => {
    const init = async () => {
      await VirtualDB.initialize();
      await fetchAllData();
      const savedAuth = localStorage.getItem('hs_auth_session');
      if (savedAuth) setCurrentUser(JSON.parse(savedAuth));
      setInitialized(true);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await VirtualDB.request<any>('POST', '/api/auth/login', { email, password });
    if (res.status === 200 && res.data) {
      setCurrentUser(res.data.user);
      localStorage.setItem('hs_auth_session', JSON.stringify(res.data.user));
      await fetchAllData();
      return true;
    }
    return false;
  };

  const register = async (payload: any) => {
    const res = await VirtualDB.request<User>('POST', '/api/auth/register', payload);
    if (res.status === 200 && res.data) {
      setCurrentUser(res.data);
      localStorage.setItem('hs_auth_session', JSON.stringify(res.data));
      await fetchAllData();
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hs_auth_session');
    localStorage.removeItem('hs_session_token_v11-prod');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) logout();
  };

  const addPatient = async (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const res = await VirtualDB.request<Patient>('POST', '/api/patients', newPatient);
    if (res.status === 200) await fetchAllData();
    else {
      // Local fallback for dev if request fails and no real API
      const patient: Patient = { ...newPatient, id: `P${Math.floor(1000 + Math.random() * 9000)}`, history: [] };
      setPatients(prev => [...prev, patient]);
    }
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setAppointments(prev => prev.filter(a => a.patientId !== id));
  };

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = { ...newApp, id: `A${Math.floor(1000 + Math.random() * 9000)}` };
    setAppointments(prev => [...prev, appointment]);
  };

  const deleteAppointment = (id: string) => setAppointments(prev => prev.filter(a => a.id !== id));

  const addDoctor = (newDoc: Omit<Doctor, 'id'>) => {
    const doctor: Doctor = { ...newDoc, id: `D${Math.floor(1000 + Math.random() * 9000)}` };
    setDoctors(prev => [...prev, doctor]);
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDoctor = (id: string) => setDoctors(prev => prev.filter(d => d.id !== id));

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!initialized) return null;

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
