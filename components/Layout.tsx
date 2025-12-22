
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Added interface for SidebarItem props and used React.FC to handle React-specific props like 'key'
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

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { to: '/patients', label: 'Patients', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    { to: '/appointments', label: 'Appointments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { to: '/doctors', label: 'Doctors', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
    { to: '/ai-assistant', label: 'AI Assistant', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-2xl mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.108.209A2 2 0 019.42 15.42l-1.42-1.42a2 2 0 010-2.828l1.42-1.42a2 2 0 012.828 0l1.42 1.42a2 2 0 010 2.828l-1.42 1.42z" /></svg>
            <span>HealSync</span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                {...item} 
                active={location.pathname === item.to} 
              />
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-6">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Storage Usage</p>
            <div className="flex justify-between text-sm mb-1">
              <span>Cloud Storage</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full">
              <div className="bg-blue-500 h-1.5 rounded-full w-[85%]"></div>
            </div>
            <button className="w-full mt-4 text-xs font-semibold bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4 bg-slate-100 px-4 py-2 rounded-full w-96">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search for patients, reports..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <img src="https://picsum.photos/seed/admin/100/100" className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
