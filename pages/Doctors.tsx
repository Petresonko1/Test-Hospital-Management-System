
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';
import { Doctor, Patient } from '../types';
import PatientDetailsModal from '../components/PatientDetailsModal';

const DoctorProfileModal = ({ doctor, onClose }: { doctor: Doctor, onClose: () => void }) => {
  const { appointments, patients } = useHospital();
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const doctorAppointments = appointments.filter(app => app.doctorName === doctor.name);

  const handlePatientClick = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) setViewingPatient(patient);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 relative">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 transition-all">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="flex flex-col items-center text-center">
            <img src={doctor.image} className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl mb-4" alt={doctor.name} />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">{doctor.name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">{doctor.specialty}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 md:mt-8">
            <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Exp.</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.experience}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Avail.</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.availability}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Load</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{doctorAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center mb-4 md:mb-6 text-sm md:text-base">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
            Assigned Visits
          </h3>

          <div className="space-y-3">
            {doctorAppointments.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-400 italic">No visits assigned</p>
            ) : (
              doctorAppointments.map(app => (
                <div key={app.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-[10px] md:text-xs">{app.patientName.charAt(0)}</div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">{app.patientName}</h4>
                      <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">{app.time}</p>
                    </div>
                  </div>
                  <button onClick={() => handlePatientClick(app.patientId)} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900 transition-all">Record</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {viewingPatient && <PatientDetailsModal patient={viewingPatient} onClose={() => setViewingPatient(null)} />}
    </div>
  );
};

const Doctors = () => {
  const { doctors, deleteDoctor, currentUser } = useHospital();
  const [isAdding, setIsAdding] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<Doctor | null>(null);

  const handleDelete = (id: string, name: string) => {
    if(confirm(`Remove ${name}?`)) deleteDoctor(id);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Medical Staff</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Directory of specialized clinical experts.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button onClick={() => setIsAdding(true)} className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all">+ Register Staff</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col items-center text-center group relative shadow-sm">
            {currentUser?.role === 'admin' && (
              <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setEditingDoctor(doctor)} className="p-2 text-amber-500 rounded-full hover:bg-amber-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
              </div>
            )}
            <img src={doctor.image} alt={doctor.name} className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] border-4 border-slate-50 dark:border-slate-800 object-cover shadow-lg mb-6" />
            <h3 className="font-bold text-lg md:text-xl text-slate-800 dark:text-white truncate w-full">{doctor.name}</h3>
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">{doctor.specialty}</p>
            
            <div className="grid grid-cols-2 gap-4 w-full text-left my-6 py-4 border-y border-slate-50 dark:border-slate-800/50">
              <div>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exp.</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.experience}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Days</p>
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{doctor.availability}</p>
              </div>
            </div>

            <button onClick={() => setSelectedDoctorProfile(doctor)} className="w-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Profile</button>
          </div>
        ))}
      </div>

      {selectedDoctorProfile && <DoctorProfileModal doctor={selectedDoctorProfile} onClose={() => setSelectedDoctorProfile(null)} />}
    </div>
  );
};

export default Doctors;
