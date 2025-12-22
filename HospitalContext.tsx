
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

  useEffect(() => {
    const init = async () => {
      await VirtualDB.initialize();
      const usersRes = await VirtualDB.get<User[]>('/api/users');
      const patientsRes = await VirtualDB.get<Patient[]>('/api/patients');
      const appointmentsRes = await VirtualDB.get<Appointment[]>('/api/appointments');
      const doctorsRes = await VirtualDB.get<Doctor[]>('/api/doctors');
      
      setUsers(usersRes.data || []);
      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setDoctors(doctorsRes.data || []);
      
      const savedAuth = localStorage.getItem('hs_auth_session');
      if (savedAuth) setCurrentUser(JSON.parse(savedAuth));
      setInitialized(true);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await VirtualDB.post<any>('/api/auth/login', { email, password });
    if (res.status === 200 && res.data) {
      setCurrentUser(res.data.user);
      localStorage.setItem('hs_auth_session', JSON.stringify(res.data.user));
      return true;
    }
    return false;
  };

  const register = async (payload: any) => {
    const res = await VirtualDB.post<User>('/api/auth/register', payload);
    if (res.status === 200 && res.data) {
      const newUser = res.data;
      if (payload.role === 'doctor') {
        const newDoc: Doctor = {
          id: `D${Math.floor(1000 + Math.random() * 9000)}`,
          name: payload.name,
          specialty: payload.specialty || 'General Physician',
          experience: payload.experience || '1 Year',
          availability: 'Mon - Fri',
          image: `https://picsum.photos/seed/${newUser.id}/200/200`
        };
        setDoctors(prev => [...prev, newDoc]);
      } else if (payload.role === 'patient') {
        const newPatient: Patient = {
          id: `P${Math.floor(1000 + Math.random() * 9000)}`,
          name: payload.name,
          age: payload.age || 0,
          gender: payload.gender || 'Other',
          bloodGroup: payload.bloodGroup || 'O+',
          status: payload.status || 'Stable',
          room: 'Unassigned',
          admissionDate: new Date().toISOString().split('T')[0],
          condition: 'Newly Registered',
          doctor: 'Unassigned',
          history: []
        };
        setPatients(prev => [...prev, newPatient]);
      }
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('hs_auth_session', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hs_auth_session');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) logout();
  };

  const addPatient = (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const patient: Patient = { ...newPatient, id: `P${Math.floor(1000 + Math.random() * 9000)}`, history: [] };
    setPatients(prev => [...prev, patient]);
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
