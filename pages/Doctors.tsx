
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <img src={doctor.image} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl" alt={doctor.name} />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white dark:border-slate-900">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{doctor.name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mt-1">{doctor.specialty}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{doctor.experience}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Availability</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.availability}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Load</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{doctorAppointments.length} Active</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
              Upcoming Appointments
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next 7 Days</span>
          </div>

          <div className="space-y-3">
            {doctorAppointments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-400">No appointments assigned to this doctor yet.</p>
              </div>
            ) : (
              doctorAppointments.map(app => (
                <div key={app.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {app.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{app.patientName}</h4>
                      <p className="text-[10px] text-slate-400">{app.date} • {app.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePatientClick(app.patientId)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                  >
                    View Record
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {viewingPatient && (
        <PatientDetailsModal 
          patient={viewingPatient} 
          onClose={() => setViewingPatient(null)} 
        />
      )}
    </div>
  );
};

const EditDoctorModal = ({ doctor, onClose }: { doctor: Doctor, onClose: () => void }) => {
  const { updateDoctor } = useHospital();
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    experience: doctor.experience,
    availability: doctor.availability
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctor(doctor.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Doctor Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Doctor Name</label>
            <input 
              required 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Specialty</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Endocrinologist">Endocrinologist</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
              <input required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Availability</label>
            <input required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDoctorModal = ({ onClose }: { onClose: () => void }) => {
  const { addDoctor } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General Physician',
    experience: '5 Years',
    availability: 'Mon - Fri',
    image: `https://picsum.photos/seed/${Math.random()}/200/200`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addDoctor(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Register New Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Doctor Name</label>
            <input 
              required 
              placeholder="Dr. Jane Doe" 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Specialty</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Endocrinologist">Endocrinologist</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
              <input required placeholder="e.g. 10 Years" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Availability</label>
            <input required placeholder="Mon, Wed, Fri" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Doctors = () => {
  const { doctors, deleteDoctor, currentUser } = useHospital();
  const [isAdding, setIsAdding] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<Doctor | null>(null);

  const handleDelete = (id: string, name: string) => {
    if(confirm(`Remove ${name} from medical staff?`)) {
      deleteDoctor(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Medical Staff</h1>
          <p className="text-slate-500 dark:text-slate-400">Directory of specialized healthcare professionals.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
          >
            + Add New Doctor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
            No doctors registered in the system.
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none transition-all group relative overflow-hidden">
              {currentUser?.role === 'admin' && (
                <div className="absolute top-6 right-6 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setEditingDoctor(doctor); }}
                    className="text-amber-400 hover:text-amber-600 p-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                    title="Edit Doctor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(doctor.id, doctor.name); }}
                    className="text-rose-300 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                    title="Remove Doctor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
              <div className="relative mb-6">
                <img src={doctor.image} alt={doctor.name} className="w-28 h-28 rounded-[2.25rem] border-4 border-slate-50 dark:border-slate-800 object-cover shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doctor.name}</h3>
              <p className="text-blue-600 dark:text-blue-500 text-xs font-bold uppercase tracking-widest mt-1">{doctor.specialty}</p>
              
              <div className="grid grid-cols-2 gap-8 w-full text-left my-6 py-4 border-y border-slate-50 dark:border-slate-800/50">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.experience}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Availability</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{doctor.availability}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedDoctorProfile(doctor)}
                className="w-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 text-slate-600 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm"
              >
                View Clinical Profile
              </button>
            </div>
          ))
        )}
      </div>

      {isAdding && <AddDoctorModal onClose={() => setIsAdding(false)} />}
      {editingDoctor && <EditDoctorModal doctor={editingDoctor} onClose={() => setEditingDoctor(null)} />}
      {selectedDoctorProfile && <DoctorProfileModal doctor={selectedDoctorProfile} onClose={() => setSelectedDoctorProfile(null)} />}
    </div>
  );
};

export default Doctors;
