
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor, User, AppNotification } from './types';
import { hashPassword } from './BackendEngine';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_USERS } from './constants';

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

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('healsync_users');
    let baseUsers = saved ? JSON.parse(saved) : MOCK_USERS;
    
    // Safety: Ensure mock users are always present and updated with latest hashes
    MOCK_USERS.forEach(mock => {
      const idx = baseUsers.findIndex((u: User) => u.email === mock.email);
      if (idx === -1) {
        baseUsers.push(mock);
      } else {
        baseUsers[idx] = { ...baseUsers[idx], passwordHash: mock.passwordHash, role: mock.role };
      }
    });
    
    return baseUsers;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('healsync_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('healsync_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('healsync_doctors');
    return saved ? JSON.parse(saved) : MOCK_DOCTORS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('healsync_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('healsync_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('healsync_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('healsync_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('healsync_doctors', JSON.stringify(doctors));
  }, [doctors]);

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
    const pHash = await hashPassword(password);
    console.log(`Attempting login for ${email} with hash: ${pHash}`);
    const user = users.find(u => u.email === email && u.passwordHash === pHash);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('healsync_current_user', JSON.stringify(user));
      addNotification('Login Successful', `Welcome back, ${user.name}`, 'system');
      return true;
    }
    console.warn("Login failed: User not found or hash mismatch.");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('healsync_current_user');
  };

  const register = async (payload: any) => {
    const pHash = await hashPassword(payload.password);
    const newUser: User = {
      id: `u${users.length + 1}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      passwordHash: pHash
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('healsync_current_user', JSON.stringify(newUser));
    addNotification('Account Created', `Profile for ${newUser.name} is ready.`, 'system');
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addPatient = async (patient: Omit<Patient, 'id' | 'history'>) => {
    const newPatient: Patient = {
      ...patient,
      id: `P00${patients.length + 1}`,
      history: []
    };
    setPatients(prev => [...prev, newPatient]);
    addNotification('Patient Admitted', `${patient.name} has been added to the directory.`, 'patient');
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (updates.status) {
      addNotification('Status Update', `Patient status changed to ${updates.status}`, 'patient');
    }
  };

  const deletePatient = async (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...appointment,
      id: `A00${appointments.length + 1}`
    };
    setAppointments(prev => [...prev, newApp]);
    addNotification('New Appointment', `Visit scheduled for ${appointment.patientName} with ${appointment.doctorName}.`, 'appointment');
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addDoctor = async (doctor: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doctor,
      id: `D00${doctors.length + 1}`
    };
    setDoctors(prev => [...prev, newDoc]);
    addNotification('Staff Added', `${doctor.name} has joined the medical team.`, 'system');
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDoctor = async (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    addNotification('Staff Removed', 'Doctor has been removed from the registry.', 'system');
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