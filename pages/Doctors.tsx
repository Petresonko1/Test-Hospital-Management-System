
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';

const AddDoctorModal = ({ onClose }: { onClose: () => void }) => {
  const { addDoctor } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General Physician',
    experience: '5 Years',
    availability: 'Mon - Fri',
    image: `https://picsum.photos/seed/${Math.random()}/200/200`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addDoctor(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Register New Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Doctor Name</label>
            <input 
              required 
              placeholder="Dr. Jane Doe" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Specialty</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Endocrinologist">Endocrinologist</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Experience</label>
              <input required placeholder="e.g. 10 Years" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Availability</label>
            <input required placeholder="Mon, Wed, Fri" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Doctors = () => {
  const { doctors, deleteDoctor, currentUser } = useHospital();
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if(confirm(`Remove ${name} from medical staff?`)) {
      deleteDoctor(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Staff</h1>
          <p className="text-slate-500">Directory of specialized healthcare professionals.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            + Add New Doctor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            No doctors registered in the system.
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-slate-200 transition-all group relative">
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(doctor.id, doctor.name); }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-rose-50"
                  title="Remove Doctor"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
              <div className="relative mb-4">
                <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover shadow-sm" />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
              <p className="text-blue-600 text-sm font-semibold mb-2">{doctor.specialty}</p>
              <div className="w-full h-[1px] bg-slate-100 my-4"></div>
              <div className="grid grid-cols-2 gap-4 w-full text-left mb-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-xs font-bold text-slate-700">{doctor.experience}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Available</p>
                  <p className="text-xs font-bold text-slate-700">{doctor.availability}</p>
                </div>
              </div>
              <button className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all">
                View Profile
              </button>
            </div>
          ))
        )}
      </div>

      {isAdding && <AddDoctorModal onClose={() => setIsAdding(false)} />}
    </div>
  );
};

export default Doctors;
