
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Patient, Appointment, Doctor } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

interface HospitalContextType {
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
  resetData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'healsync_patients',
  APPOINTMENTS: 'healsync_appointments',
};

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or fallback to MOCK data
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  const addPatient = (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `P${Math.floor(1000 + Math.random() * 9000)}`, // Robust ID generation
      history: []
    };
    setPatients(prev => [...prev, patient]);
  };

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newApp,
      id: `A${Math.floor(1000 + Math.random() * 9000)}`
    };
    setAppointments(prev => [...prev, appointment]);
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const resetData = () => {
    setPatients(MOCK_PATIENTS);
    setAppointments(MOCK_APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
  };

  return (
    <HospitalContext.Provider value={{ 
      patients, 
      appointments, 
      doctors, 
      addPatient, 
      addAppointment, 
      updatePatientStatus,
      resetData
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
