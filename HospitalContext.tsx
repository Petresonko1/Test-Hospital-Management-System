
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Appointment, Doctor } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from './constants';

interface HospitalContextType {
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  addPatient: (patient: Omit<Patient, 'id' | 'history'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);

  const addPatient = (newPatient: Omit<Patient, 'id' | 'history'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `P00${patients.length + 1}`,
      history: []
    };
    setPatients([...patients, patient]);
  };

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newApp,
      id: `A00${appointments.length + 1}`
    };
    setAppointments([...appointments, appointment]);
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <HospitalContext.Provider value={{ patients, appointments, doctors, addPatient, addAppointment, updatePatientStatus }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital must be used within a HospitalProvider');
  return context;
};
