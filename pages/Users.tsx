
import React, { useState, useEffect } from 'react';
import { useHospital } from '../HospitalContext';
import { VirtualDB, ServerLog } from '../BackendEngine';

const Users = () => {
  const { resetData } = useHospital();
  const [activeTab, setActiveTab] = useState<'database' | 'logs' | 'api' | 'hosting'>('database');
  const [dbData, setDbData] = useState<any>(null);
  const [logs, setLogs] = useState<ServerLog[]>([]);

  useEffect(() => {
    const refresh = async () => {
      const dump = VirtualDB.getFullDump();
      setDbData(dump);
      const serverLogs = await VirtualDB.get<ServerLog[]>('/api/system/logs');
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
          <h1 className="text-2xl font-bold text-slate-800">DevOps & System Console</h1>
          <p className="text-slate-500 font-medium">Real-time backend control and production migration tools.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => resetData()}
            className="bg-white border border-rose-200 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all"
          >
            Flush Database
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 overflow-x-auto">
          {[
            { id: 'database', label: '🗄️ Database Explorer' },
            { id: 'logs', label: '📡 Real-time Logs' },
            { id: 'api', label: '🔌 API Documentation' },
            { id: 'hosting', label: '☁️ Cloud Hosting' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 min-h-[500px]">
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Relational Storage Dump</h3>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-1 rounded">LOCAL_STORAGE_PERSISTENT</span>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-400">
                  {JSON.stringify(dbData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">HTTP Traffic (Last 50 Events)</h3>
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in slide-in-from-right-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded w-16 text-center ${log.method === 'POST' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {log.method}
                    </span>
                    <span className="text-xs font-mono text-slate-500 flex-1">{log.url}</span>
                    <span className={`text-[10px] font-bold ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</span>
                    <span className="text-[10px] text-slate-300 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Endpoint Definitions</h3>
                <div className="space-y-4">
                  {[
                    { path: 'POST /api/auth/login', desc: 'Authenticates user and returns JWT token.' },
                    { path: 'POST /api/auth/register', desc: 'Creates user account and hashes password.' },
                    { path: 'GET /api/patients', desc: 'Fetch all admitted patient records.' },
                    { path: 'GET /api/appointments', desc: 'Fetch all clinical visit records.' }
                  ].map((api, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="font-mono text-xs font-bold text-blue-600">{api.path}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{api.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-3xl p-6 text-slate-300 font-mono text-[10px] leading-relaxed">
                <p className="text-emerald-400 mb-2">// Recommended Security Header</p>
                <p>Authorization: Bearer {'<jwt_token>'}</p>
                <p>Content-Type: application/json</p>
                <p className="mt-4 text-emerald-400">// Server-side Hashing (BCrypt)</p>
                <p>const hash = await bcrypt.hash(password, 12);</p>
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="max-w-3xl mx-auto space-y-10">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">Ready to Launch?</h3>
                <p className="text-slate-500 text-sm mt-1">Move this application to a real cloud infrastructure in minutes.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-4">Option A: Vercel / Netlify</h4>
                  <ul className="text-xs text-blue-700 space-y-3">
                    <li>1. Push this folder to <strong>GitHub</strong></li>
                    <li>2. Import Project in Vercel Dashboard</li>
                    <li>3. Add <code>API_KEY</code> to Environment Variables</li>
                    <li>4. <strong>Live!</strong> (Automated SSL & CDN)</li>
                  </ul>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl text-white">
                  <h4 className="font-bold text-slate-300 mb-4">Option B: Docker Self-Hosting</h4>
                  <pre className="text-[9px] font-mono leading-tight text-emerald-400">
{`FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]`}
                  </pre>
                </div>
              </div>

              <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">⚠️</div>
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">Critical Security Note</h4>
                  <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                    Once you migrate, ensure you move <strong>Password Hashing</strong> to the server-side. Do not trust client-side hashing for production as it is susceptible to man-in-the-middle attacks. Always use HTTPS (TLS) for all API communications.
                  </p>
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
