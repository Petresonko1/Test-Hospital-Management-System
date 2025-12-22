
import React, { useState, useEffect } from 'react';
import { useHospital } from '../HospitalContext';
import { VirtualDB, ServerLog } from '../BackendEngine';

const SQL_SCHEMA = `-- HealSync Production Schema (PostgreSQL)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'doctor', 'patient'))
);

CREATE TABLE doctors (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    specialty TEXT,
    experience TEXT,
    availability TEXT,
    image_url TEXT
);

CREATE TABLE patients (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    blood_group TEXT,
    status TEXT CHECK (status IN ('Stable', 'Critical', 'Discharged', 'In Treatment')),
    room TEXT,
    admission_date DATE DEFAULT CURRENT_DATE,
    condition_desc TEXT
);

CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES patients(id),
    doctor_id TEXT REFERENCES doctors(id),
    appointment_date DATE,
    appointment_time TEXT,
    status TEXT DEFAULT 'Scheduled'
);`;

const Users = () => {
  const { resetData } = useHospital();
  const [activeTab, setActiveTab] = useState<'database' | 'logs' | 'api' | 'migration'>('database');
  const [dbData, setDbData] = useState<any>(null);
  const [logs, setLogs] = useState<ServerLog[]>([]);

  useEffect(() => {
    const refresh = async () => {
      const dump = VirtualDB.getFullDump();
      setDbData(dump);
      const serverLogs = await VirtualDB.request<ServerLog[]>('GET', '/api/system/logs');
      setLogs(serverLogs.data || []);
    };
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Production Control</h1>
          <p className="text-slate-500 font-medium">Tools to transition from Local Dev to Cloud Production.</p>
        </div>
        <button onClick={() => resetData()} className="bg-rose-50 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all">
          Flush Local DB
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 overflow-x-auto">
          {[
            { id: 'database', label: '🗄️ Explorer' },
            { id: 'logs', label: '📡 Network Logs' },
            { id: 'api', label: '🔌 API Specs' },
            { id: 'migration', label: '🚀 Database Migration' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 min-h-[500px]">
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Local Data View</h3>
              <div className="bg-slate-900 rounded-3xl p-6 overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-400">{JSON.stringify(dbData, null, 2)}</pre>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">HTTP Traffic</h3>
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded w-16 text-center ${log.method === 'POST' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>{log.method}</span>
                    <span className="text-xs font-mono text-slate-500 flex-1">{log.url}</span>
                    <span className={`text-[10px] font-bold ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'migration' && (
            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">How to use a Real Database:</h4>
                <ol className="text-xs text-blue-700 space-y-2 list-decimal ml-4">
                  <li>Provision a database on <strong>Supabase</strong>, <strong>Railway</strong>, or <strong>PlanetScale</strong>.</li>
                  <li>Run the SQL script below to create your tables.</li>
                  <li>Build a backend (Node.js/Express is recommended) to handle these queries.</li>
                  <li>Set your <code>VITE_API_URL</code> environment variable to your server's address.</li>
                </ol>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 relative">
                <button 
                  onClick={() => navigator.clipboard.writeText(SQL_SCHEMA)}
                  className="absolute top-4 right-4 text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded hover:text-white"
                >
                  Copy SQL
                </button>
                <pre className="text-xs font-mono text-blue-300 overflow-x-auto">{SQL_SCHEMA}</pre>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Payload Documentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-800">Auth Login</p>
                  <code className="text-[10px] text-blue-600">POST /api/auth/login</code>
                  <pre className="text-[9px] mt-2 text-slate-500">{`{ "email": "str", "password": "str" }`}</pre>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-800">Get Patients</p>
                  <code className="text-[10px] text-blue-600">GET /api/patients</code>
                  <p className="text-[9px] mt-2 text-slate-500">Requires Bearer Token</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
