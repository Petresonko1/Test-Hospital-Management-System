
import React from 'react';
import { MOCK_DOCTORS } from '../constants';

const Doctors = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Staff</h1>
          <p className="text-slate-500">Directory of specialized healthcare professionals.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          Manage Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DOCTORS.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer group">
            <div className="relative mb-4">
              <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover" />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
            <p className="text-blue-600 text-sm font-semibold">{doctor.specialty}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Doctors;
