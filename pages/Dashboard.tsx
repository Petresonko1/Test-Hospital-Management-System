
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useHospital } from '../HospitalContext';

const data = [
  { name: 'Mon', patients: 40 },
  { name: 'Tue', patients: 30 },
  { name: 'Wed', patients: 45 },
  { name: 'Thu', patients: 55 },
  { name: 'Fri', patients: 60 },
  { name: 'Sat', patients: 20 },
  { name: 'Sun', patients: 15 },
];

const TOTAL_BED_CAPACITY = 150;

const StatCard = ({ label, value, trend, trendUp, icon }: { label: string, value: string | number, trend: string, trendUp: boolean, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 md:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {icon}
      </div>
      <div className={`flex items-center text-[10px] md:text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">{label}</p>
    <h3 className="text-xl md:text-2xl font-bold mt-1 text-slate-800 dark:text-white">{value}</h3>
  </div>
);

const Dashboard = () => {
  const { patients, appointments, doctors, theme } = useHospital();

  const admittedPatients = patients.filter(p => p.status !== 'Discharged').length;
  const occupancyRate = Math.round((admittedPatients / TOTAL_BED_CAPACITY) * 100);

  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Hospital Overview</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">HealSync clinical operations status for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Patients" 
          value={patients.length} 
          trend="Live" 
          trendUp={true} 
          icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard 
          label="Appointments" 
          value={appointments.length} 
          trend="Active" 
          trendUp={true} 
          icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard 
          label="Bed Occupancy" 
          value={`${occupancyRate}%`} 
          trend="Realtime" 
          trendUp={occupancyRate < 90} 
          icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard 
          label="Staff on Duty" 
          value={doctors.length} 
          trend="Active" 
          trendUp={true} 
          icon={<svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="font-bold text-base md:text-lg dark:text-white">Patient Flow</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] md:text-sm px-2 md:px-3 py-1 outline-none dark:text-slate-300">
              <option>7D</option>
              <option>30D</option>
            </select>
          </div>
          <div className="h-60 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: theme === 'dark' ? '#1e293b' : '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: tooltipBg,
                    color: textColor,
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="font-bold text-base md:text-lg dark:text-white">Medical Trends</h3>
            <div className="flex space-x-2">
              <span className="flex items-center text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span> Active
              </span>
            </div>
          </div>
          <div className="h-60 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 10}} />
                <Tooltip contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: tooltipBg,
                  color: textColor,
                  fontSize: '12px'
                }} />
                <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2.5} dot={{r: 3, fill: '#3b82f6'}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
