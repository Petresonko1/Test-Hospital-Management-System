
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHospital } from '../HospitalContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetData, currentUser, logout } = useHospital();

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allMenuItems = [
    { to: '/', label: 'Dashboard', roles: ['admin', 'doctor'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { to: '/patients', label: 'Patients', roles: ['admin', 'doctor'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    { to: '/appointments', label: currentUser.role === 'patient' ? 'My Visits' : 'Appointments', roles: ['admin', 'doctor', 'patient'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
    )},
    { to: '/doctors', label: 'Medical Staff', roles: ['admin', 'doctor', 'patient'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
    { to: '/ai-assistant', label: 'AI Health', roles: ['admin', 'doctor', 'patient'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )},
    { to: '/system', label: 'Backend Control', roles: ['admin'], icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    )},
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-8 flex-1">
          <div className="flex items-center space-x-3 text-blue-600 font-bold text-2xl mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.108.209A2 2 0 019.42 15.42l-1.42-1.42a2 2 0 010-2.828l1.42-1.42a2 2 0 012.828 0l1.42 1.42a2 2 0 010 2.828l-1.42 1.42z" /></svg>
            </div>
            <span>HealSync</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                {...item} 
                active={location.pathname === item.to} 
              />
            ))}
          </nav>
        </div>

        <div className="p-8 space-y-4">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.role} Control</p>
              </div>
              <p className="text-xs text-slate-300 font-medium">Verified local session active for {currentUser.name}.</p>
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => {
                    if(confirm('Are you sure you want to reset all data?')) resetData();
                  }}
                  className="w-full mt-6 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest text-left"
                >
                  Hard Reset System
                </button>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
          >
            <span>Sign Out</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4 bg-slate-50 px-5 py-2.5 rounded-2xl w-full max-w-lg border border-slate-200/50">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>
          <div className="flex items-center space-x-8">
            <button className="text-slate-400 hover:text-slate-600 relative p-2 rounded-xl hover:bg-slate-50 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{currentUser.role}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 p-0.5 border border-slate-200">
                <img src={`https://picsum.photos/seed/${currentUser.id}/200/200`} className="w-full h-full rounded-xl object-cover" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 overflow-y-auto h-full scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
