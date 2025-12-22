
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHospital } from '../HospitalContext';
import { UserRole, PatientStatus } from '../types';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as UserRole,
    // Role specific fields
    age: '25',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    status: 'Stable' as PatientStatus,
    specialty: 'General Physician',
    experience: '5 Years'
  });
  
  const { register } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: parseInt(formData.age)
    };
    register(payload);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Join HealSync</h1>
          <p className="text-slate-400 mt-2 font-medium">Create your clinical or patient profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
              <input 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">I am a...</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-blue-600"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <input 
                required 
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="name@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <input 
                required 
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Patient Specific Fields */}
          {formData.role === 'patient' && (
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Medical Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                  <input type="number" className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Clinical Status</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none font-bold text-slate-700" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as PatientStatus})}>
                    <option value="Stable">Stable</option>
                    <option value="In Treatment">In Treatment</option>
                    <option value="Critical">Critical</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Specific Fields */}
          {formData.role === 'doctor' && (
            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Clinical Qualifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Specialization</label>
                  <input placeholder="e.g. Cardiologist" className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Years of Experience</label>
                  <input placeholder="e.g. 12 Years" className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
          >
            Create {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Profile
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
