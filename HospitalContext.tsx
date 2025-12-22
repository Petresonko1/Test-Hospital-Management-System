
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor, User, AppNotification } from './types';
import { VirtualDB } from './BackendEngine';

interface HospitalContextType {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  notifications: AppNotification[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  markNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type']) => void;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('healsync_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('healsync_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const refreshData = async () => {
    const patientsRes = await VirtualDB.request<Patient[]>('GET', '/api/patients');
    const doctorsRes = await VirtualDB.request<Doctor[]>('GET', '/api/doctors');
    const appointmentsRes = await VirtualDB.request<Appointment[]>('GET', '/api/appointments');
    const usersRes = await VirtualDB.request<User[]>('GET', '/api/users');

    if (patientsRes.data) setPatients(patientsRes.data);
    if (doctorsRes.data) setDoctors(doctorsRes.data);
    if (appointmentsRes.data) setAppointments(appointmentsRes.data);
    if (usersRes.data) setUsers(usersRes.data);
  };

  useEffect(() => {
    const init = async () => {
      await VirtualDB.initialize();
      await refreshData();
      
      // Initial notification
      addNotification('System Online', 'HealSync secure virtual environment initialized.', 'system');
    };
    init();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('healsync_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substring(7),
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = async (email: string, password: string) => {
    const res = await VirtualDB.request<{ user: User, token: string }>('POST', '/api/auth/login', { email, password });
    if (res.status === 200 && res.data) {
      setCurrentUser(res.data.user);
      localStorage.setItem('healsync_current_user', JSON.stringify(res.data.user));
      addNotification('Login Successful', `Welcome back, ${res.data.user.name}`, 'system');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('healsync_current_user');
    localStorage.removeItem(VirtualDB.getSessionTokenKey());
  };

  const register = async (payload: any) => {
    const res = await VirtualDB.request<User>('POST', '/api/auth/register', payload);
    if (res.status === 200 && res.data) {
      setCurrentUser(res.data);
      localStorage.setItem('healsync_current_user', JSON.stringify(res.data));
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await VirtualDB.request('PUT', '/api/users', { id, ...updates });
    await refreshData();
  };

  const deleteUser = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/users/${id}`);
    await refreshData();
  };

  const addPatient = async (patient: Omit<Patient, 'id' | 'history'>) => {
    await VirtualDB.request('POST', '/api/patients', { ...patient, history: [] });
    addNotification('Patient Admitted', `${patient.name} has been added to the directory.`, 'patient');
    await refreshData();
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    await VirtualDB.request('PUT', '/api/patients', { id, ...updates });
    if (updates.status) {
      addNotification('Status Update', `Patient status changed to ${updates.status}`, 'patient');
    }
    await refreshData();
  };

  const deletePatient = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/patients/${id}`);
    await refreshData();
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    await VirtualDB.request('POST', '/api/appointments', appointment);
    addNotification('New Appointment', `Visit scheduled for ${appointment.patientName} with ${appointment.doctorName}.`, 'appointment');
    await refreshData();
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    await VirtualDB.request('PUT', '/api/appointments', { id, ...updates });
    await refreshData();
  };

  const deleteAppointment = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/appointments/${id}`);
    await refreshData();
  };

  const addDoctor = async (doctor: Omit<Doctor, 'id'>) => {
    await VirtualDB.request('POST', '/api/doctors', doctor);
    addNotification('Staff Added', `${doctor.name} has joined the medical team.`, 'system');
    await refreshData();
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    await VirtualDB.request('PUT', '/api/doctors', { id, ...updates });
    await refreshData();
  };

  const deleteDoctor = async (id: string) => {
    await VirtualDB.request('DELETE', `/api/doctors/${id}`);
    await refreshData();
  };

  const resetData = async () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <HospitalContext.Provider value={{
      currentUser, users, patients, appointments, doctors, notifications,
      theme, toggleTheme,
      login, logout, register, markNotificationsRead, addNotification,
      updateUser, deleteUser,
      addPatient, updatePatient, deletePatient,
      addAppointment, updateAppointment, deleteAppointment,
      addDoctor, updateDoctor, deleteDoctor,
      resetData
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
