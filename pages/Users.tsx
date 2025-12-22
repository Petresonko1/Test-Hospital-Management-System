
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';
import { User, Patient, Doctor, Appointment } from '../types';

const Users = () => {
  const { users, patients, doctors, appointments, resetData } = useHospital();
  const [activeTab, setActiveTab] = useState<'users' | 'patients' | 'doctors' | 'appointments' | 'migration'>('users');

  const getTableData = () => {
    switch(activeTab) {
      case 'users': return users;
      case 'patients': return patients;
      case 'doctors': return doctors;
      case 'appointments': return appointments;
      default: return [];
    }
  };

  const exportDB = () => {
    const data = {
      version: 'v8-secure',
      exportedAt: new Date().toISOString(),
      database: { users, patients, doctors, appointments }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healsync_db_export_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Database Explorer</h1>
          <p className="text-slate-500">Full Relational View of the HealSync "Backend" Store.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportDB}
            className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Export SQL/JSON</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2">
          {['users', 'patients', 'doctors', 'appointments', 'migration'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}_table
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'migration' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Production Migration Guide</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 text-sm mb-1">Step 1: Choose a Stack</h4>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      This frontend is designed to consume a JSON REST API. You can host a <strong>Node.js (Express)</strong> or <strong>Python (FastAPI)</strong> backend on <strong>Heroku, Vercel, or AWS</strong>.
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-800 text-sm mb-1">Step 2: Database Setup</h4>
                    <p className="text-xs text-indigo-600 leading-relaxed">
                      Use <strong>PostgreSQL</strong> (Relational) or <strong>MongoDB</strong> (Document). Our schema (see JSON tabs) is compatible with both. Map our "id" fields to your primary keys.
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <h4 className="font-bold text-rose-800 text-sm mb-1">Step 3: Security</h4>
                    <p className="text-xs text-rose-600 leading-relaxed">
                      Currently using <code>SHA-256</code> client-side hashing. In production, use <strong>BCrypt</strong> with a salt on the server-side and issue <strong>JWT (JSON Web Tokens)</strong> for session management.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <h3 className="text-lg font-bold mb-4 text-emerald-400">Sample API Route (Node.js)</h3>
                <pre className="text-[10px] font-mono leading-relaxed text-slate-300 overflow-x-auto">
{`app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });
  
  if (user && await bcrypt.compare(password, user.hash)) {
    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token, user: sanitize(user) });
  } else {
    res.status(401).send('Invalid Credentials');
  }
});`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-tighter">
                  Showing raw query result: SELECT * FROM {activeTab}_table
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">200 OK</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 overflow-x-auto max-h-[500px]">
                <pre className="text-xs font-mono text-slate-600 whitespace-pre">
                  {JSON.stringify(getTableData(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
