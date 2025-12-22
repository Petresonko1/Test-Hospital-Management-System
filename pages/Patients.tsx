
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';
import { Patient, PatientStatus } from '../types';
import { getMedicalInsights } from '../services/geminiService';

const StatusBadge = ({ status }: { status: PatientStatus }) => {
  const styles = {
    Stable: 'bg-emerald-50 text-emerald-600',
    Critical: 'bg-rose-50 text-rose-600',
    Discharged: 'bg-slate-50 text-slate-600',
    'In Treatment': 'bg-blue-50 text-blue-600'
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-sm text-slate-500">ID: {patient.id} • {patient.age}y • {patient.gender}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals & Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="font-semibold">{patient.bloodGroup}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Status</span>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Admitted Date</span>
                  <span className="font-medium">{patient.admissionDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Assigned Doctor</span>
                  <span className="text-blue-600 font-medium">{patient.doctor}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Main Condition</h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{patient.condition || 'No description provided'}"
              </p>
            </section>

            <button 
              onClick={fetchInsights}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>{loading ? 'Analyzing...' : 'Generate AI Insights'}</span>
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            {!insights ? (
              <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800">No AI insights generated yet</h4>
                <p className="text-sm text-slate-500 mt-1">Click the button on the left to analyze patient data using Gemini 3.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-800 font-bold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    Clinical Summary
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{insights.summary}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                    <h4 className="text-rose-800 font-bold mb-3 text-sm">Potential Risks</h4>
                    <ul className="space-y-2">
                      {insights.risks?.map((risk: string, i: number) => (
                        <li key={i} className="text-xs text-rose-700 flex items-start">
                          <span className="mr-2">•</span> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="text-emerald-800 font-bold mb-3 text-sm">Dietary Plan</h4>
                    <ul className="space-y-2">
                      {insights.dietPlan?.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-emerald-700 flex items-start">
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
    status: 'Stable' as const,
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
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Admit New Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
              <input 
                required 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Doctor</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Condition Description</label>
            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-24" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Admit Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Patients = () => {
  const { patients, deletePatient, currentUser } = useHospital();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
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
          <h1 className="text-2xl font-bold text-slate-800">Patient Directory</h1>
          <p className="text-slate-500">Manage and view detailed medical records of your patients.</p>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            + Admit New Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-slate-200 w-full max-w-md">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4 font-bold">Patient</th>
                <th className="px-6 py-4 font-bold">Age/Sex</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Doctor</th>
                <th className="px-6 py-4 font-bold">Room</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No patients found.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{patient.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{patient.age} / {patient.gender.charAt(0)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{patient.doctor}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{patient.room}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-4">
                        <button 
                          onClick={() => setSelectedPatient(patient)}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold transition-all"
                        >
                          View
                        </button>
                        {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
                          <button 
                            onClick={() => handleDelete(patient.id, patient.name)}
                            className="text-slate-300 hover:text-rose-500 transition-all p-2 rounded-lg hover:bg-rose-50"
                            title="Delete Patient"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
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

      {isAdding && (
        <AddPatientModal onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Patients;
