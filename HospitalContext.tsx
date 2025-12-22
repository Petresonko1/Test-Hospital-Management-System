
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
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  updatePatientStatus: (id: string, status: Patient['status']) => Promise<void>;
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
      const newUser = res.data;
      // Also initialize profile if role is patient/doctor
      if (payload.role === 'patient') {
        await VirtualDB.request('POST', '/api/patients', { 
          name: payload.name, 
          age: parseInt(payload.age) || 0,
          gender: payload.gender,
          bloodGroup: payload.bloodGroup,
          status: payload.status,
          room: 'Unassigned',
          admissionDate: new Date().toISOString().split('T')[0],
          condition: 'New Registration',
          doctor: 'Unassigned',
          history: []
        });
      } else if (payload.role === 'doctor') {
        await VirtualDB.request('POST', '/api/doctors', {
          name: payload.name,
          specialty: payload.specialty,
          experience: payload.experience,
          availability: 'Mon - Fri',
          image: `https://picsum.photos/seed/${newUser.id}/200/200`
        });
      }
      setCurrentUser(newUser);
      localStorage.setItem('hs_auth_session', JSON.stringify(newUser));
      await fetchAllData();
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hs_auth_session');
    // Clear virtual session token but keep database
    localStorage.removeItem(`hs_session_token_v12-final`);
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await VirtualDB.request('PUT', '/api/users', { id, ...updates });
    await fetchAllData();
  };

  const deleteUser = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/users/${id}`);
    await fetchAllData();
  };

  const addPatient = async (newPatient: Omit<Patient, 'id' | 'history'>) => {
    await VirtualDB.request('POST', '/api/patients', { ...newPatient, history: [] });
    await fetchAllData();
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    await VirtualDB.request('PUT', '/api/patients', { id, ...updates });
    await fetchAllData();
  };

  const deletePatient = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/patients/${id}`);
    await fetchAllData();
  };

  const addAppointment = async (newApp: Omit<Appointment, 'id'>) => {
    await VirtualDB.request('POST', '/api/appointments', newApp);
    await fetchAllData();
  };

  const deleteAppointment = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/appointments/${id}`);
    await fetchAllData();
  };

  const addDoctor = async (newDoc: Omit<Doctor, 'id'>) => {
    await VirtualDB.request('POST', '/api/doctors', newDoc);
    await fetchAllData();
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    await VirtualDB.request('PUT', '/api/doctors', { id, ...updates });
    await fetchAllData();
  };

  const deleteDoctor = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/doctors/${id}`);
    await fetchAllData();
  };

  const updatePatientStatus = async (id: string, status: Patient['status']) => {
    await VirtualDB.request('PUT', '/api/patients', { id, status });
    await fetchAllData();
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
