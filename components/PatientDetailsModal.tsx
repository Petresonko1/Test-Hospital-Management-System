
import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types';
import { getMedicalInsights } from '../services/geminiService';

export const StatusBadge = ({ status }: { status: PatientStatus }) => {
  const styles = {
    Stable: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    Critical: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    Discharged: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'In Treatment': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
};

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, onClose }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getMedicalInsights(patient);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{patient.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ID: {patient.id} • {patient.age}y • {patient.gender}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals & Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Blood Group</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">{patient.bloodGroup}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Current Status</span>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Room</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{patient.room}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Doctor</span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{patient.doctor}</span>
                </div>
              </div>
            </section>

            <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Diagnosis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed italic">
                "{patient.condition || 'No active condition description'}"
              </p>
            </section>

            <button 
              onClick={fetchInsights}
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-blue-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {loading ? (
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
              </svg>
              <span>{loading ? 'Consulting Gemini...' : 'Get AI Medical Insight'}</span>
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            {!insights ? (
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                  <svg className="w-8 h-8 text-blue-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">AI Clinical Intelligence Ready</h4>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-xs">Generate specialized insights about risks, diet, and recommendations based on current records.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-blue-800 dark:text-blue-400 font-bold mb-3 flex items-center text-sm uppercase tracking-wider">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    Clinical Summary
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{insights.summary}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30">
                    <h4 className="text-rose-800 dark:text-rose-400 font-bold mb-4 text-xs uppercase tracking-widest flex items-center">
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.472 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       Risk Factors
                    </h4>
                    <ul className="space-y-3">
                      {insights.risks?.map((risk: string, i: number) => (
                        <li key={i} className="text-xs text-rose-700 dark:text-rose-300 flex items-start">
                          <span className="w-1.5 h-1.5 bg-rose-400 dark:bg-rose-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="text-emerald-800 dark:text-emerald-400 font-bold mb-4 text-xs uppercase tracking-widest flex items-center">
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                       Nutrition Plan
                    </h4>
                    <ul className="space-y-3">
                      {insights.dietPlan?.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start">
                          <span className="w-1.5 h-1.5 bg-emerald-400 dark:bg-emerald-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 text-[10px] text-slate-500 border border-slate-800 leading-relaxed italic">
                  <strong>Clinical Note:</strong> AI suggestions are intended for internal medical staff support only and should be verified against standard clinical protocols.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
