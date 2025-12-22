
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';
import { User, UserRole } from '../types';

const EditUserModal = ({ user, onClose }: { user: User, onClose: () => void }) => {
  const { updateUser } = useHospital();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: user.password || 'password123'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Edit System User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Account Name</label>
            <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
            <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">System Role</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-500">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200">Update Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Users = () => {
  const { users, deleteUser, currentUser } = useHospital();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      alert("You cannot delete your own admin account while logged in.");
      return;
    }
    if (confirm(`CAUTION: Deleting user ${user.name} will remove their access to the system. Proceed?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System "Backend" Control</h1>
          <p className="text-slate-500">Manage raw authentication records and system access levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Accounts</p>
            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Store</p>
            <p className="text-2xl font-bold text-slate-800 uppercase tracking-tighter">LocalStorage</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl text-white flex items-center space-x-4">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Engine</p>
            <p className="text-2xl font-bold">React Context</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name & Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Raw Password</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{user.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-600' :
                      user.role === 'doctor' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">
                      {user.password}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Under the Hood</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-blue-100 leading-relaxed">
            <p>
              This backend is powered by <strong>Local Persistence Hooks</strong>. When you update a user or profile, the app performs an atomic state update and serializes the entire database to the browser's <code>localStorage</code>. 
            </p>
            <p>
              In a production environment, these Context methods would be replaced by <code>fetch()</code> or <code>axios</code> calls to a REST/GraphQL API on a Node.js server, but the UI and logic would remain identical.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />}
    </div>
  );
};

export default Users;
