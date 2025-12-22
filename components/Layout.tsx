
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useHospital } from '../HospitalContext';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetData, currentUser, logout, theme, toggleTheme, notifications, markNotificationsRead, patients, doctors } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredStaff = doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleNotif = () => {
    if (!showNotifDropdown) markNotificationsRead();
    setShowNotifDropdown(!showNotifDropdown);
  };

  const handleSearchIconClick = () => {
    searchInputRef.current?.focus();
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

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="p-8 flex-1">
        <div className="flex items-center space-x-3 text-blue-600 font-bold text-2xl mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
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
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>
      </div>

      <div className="p-8 space-y-4">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.role} Control</p>
            </div>
            <p className="text-xs text-slate-300 font-medium">Verified session for {currentUser.name}.</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-500 transition-all font-bold"
        >
          <span>Sign Out</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <aside className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent isMobile />
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3 mr-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div ref={searchRef} className="relative w-full max-w-[150px] md:max-w-lg">
              <div className="flex items-center space-x-2 md:space-x-4 bg-slate-50 dark:bg-slate-800 px-3 md:px-5 py-2.5 rounded-2xl w-full border border-slate-200/50 dark:border-slate-700/50 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all">
                <button 
                  onClick={handleSearchIconClick}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors hidden sm:block"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium dark:text-slate-200 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                />
              </div>
              {showSearchDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 md:w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                    {filteredStaff.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Staff</h4>
                        {filteredStaff.map(d => (
                          <button key={d.id} onClick={() => {navigate('/doctors'); setShowSearchDropdown(false); setSearchQuery('');}} className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-left">
                            <img src={d.image} className="w-8 h-8 rounded-full" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{d.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{d.specialty}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredPatients.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Patients</h4>
                        {filteredPatients.map(p => (
                          <button key={p.id} onClick={() => {navigate('/patients'); setShowSearchDropdown(false); setSearchQuery('');}} className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-left">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-[10px]">{p.name.charAt(0)}</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">ID: {p.id}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            <div ref={notifRef} className="relative">
              <button 
                onClick={handleToggleNotif}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 relative p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
              </button>
              
              {showNotifDropdown && (
                <div className="absolute top-full right-0 mt-4 w-72 md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Alerts</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-400 italic">No new alerts</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                <p className="text-[9px] md:text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest leading-none">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <img src={`https://picsum.photos/seed/${currentUser.id}/200/200`} className="w-full h-full rounded-lg md:rounded-xl object-cover" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 overflow-y-auto h-full scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
