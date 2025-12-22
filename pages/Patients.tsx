
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';
import { Patient, PatientStatus } from '../types';
import { getMedicalInsights } from '../services/geminiService';

const StatusBadge = ({ status }: { status: PatientStatus }) => {
  const styles = {
    Stable: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    Critical: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    Discharged: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'In Treatment': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
};

const EditPatientModal = ({ patient, onClose }: { patient: Patient, onClose: () => void }) => {
  const { updatePatient, doctors } = useHospital();
  const [formData, setFormData] = useState({
    name: patient.name,
    age: patient.age.toString(),
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    room: patient.room,
    doctor: patient.doctor,
    status: patient.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, {
      ...formData,
      age: parseInt(formData.age) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl p-8 space-y-6 transition-all">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Patient Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                required 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="Stable">Stable</option>
                <option value="In Treatment">In Treatment</option>
                <option value="Critical">Critical</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Room</label>
              <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Doctor</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientDetailsModal = ({ patient, onClose }: { patient: Patient, onClose: () => void }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getMedicalInsights(patient);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{patient.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ID: {patient.id} • {patient.age}y • {patient.gender}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals & Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Blood Group</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{patient.bloodGroup}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Current Status</span>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Admitted Date</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{patient.admissionDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Doctor</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{patient.doctor}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Main Condition</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 italic">
                "{patient.condition || 'No description provided'}"
              </p>
            </section>

            <button 
              onClick={fetchInsights}
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>{loading ? 'Analyzing...' : 'Generate AI Insights'}</span>
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            {!insights ? (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 transition-all">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">No AI insights generated yet</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click the button on the left to analyze patient data using Gemini 3.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-blue-800 dark:text-blue-400 font-bold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    Clinical Summary
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insights.summary}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                    <h4 className="text-rose-800 dark:text-rose-400 font-bold mb-3 text-sm">Potential Risks</h4>
                    <ul className="space-y-2">
                      {insights.risks?.map((risk: string, i: number) => (
                        <li key={i} className="text-xs text-rose-700 dark:text-rose-300 flex items-start">
                          <span className="mr-2">•</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="text-emerald-800 dark:text-emerald-400 font-bold mb-3 text-sm">Dietary Plan</h4>
                    <ul className="space-y-2">
                      {insights.dietPlan?.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start">
                          <span className="mr-2">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddPatientModal = ({ onClose }: { onClose: () => void }) => {
  const { addPatient, doctors } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    age: '30',
    gender: 'Male' as const,
    bloodGroup: 'O+',
    status: 'Stable' as PatientStatus,
    condition: '',
    doctor: doctors[0]?.name || 'Unassigned',
    room: '101A'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    addPatient({
      ...formData,
      age: parseInt(formData.age) || 0,
      admissionDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl p-8 space-y-6 transition-all">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admit New Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                required 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none dark:text-slate-200" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Clinical Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold text-blue-600 dark:text-blue-400" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as PatientStatus})}>
                <option value="Stable">Stable</option>
                <option value="In Treatment">In Treatment</option>
                <option value="Critical">Critical</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Doctor</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Room</label>
              <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 dark:text-slate-200" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Condition Description</label>
            <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-24 dark:text-slate-200" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none">Admit Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Patients = () => {
  const { patients, deletePatient, currentUser } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? All associated appointments will also be removed.`)) {
      deletePatient(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Patient Directory</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and view detailed medical records of your patients.</p>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95"
          >
            + Admit New Patient
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-md transition-all">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium dark:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 font-bold">Patient</th>
                <th className="px-6 py-4 font-bold">Age/Sex</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Doctor</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No patients found.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{patient.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">ID: {patient.id} • Room: {patient.room}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{patient.age} / {patient.gender.charAt(0)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{patient.doctor}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setSelectedPatient(patient)}
                          className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                        >
                          View
                        </button>
                        {currentUser?.role === 'admin' && (
                          <>
                            <button 
                              onClick={() => setEditingPatient(patient)}
                              className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(patient.id, patient.name)}
                              className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
                              title="Delete Patient"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <PatientDetailsModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}

      {editingPatient && (
        <EditPatientModal 
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
        />
      )}

      {isAdding && (
        <AddPatientModal onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Patients;
