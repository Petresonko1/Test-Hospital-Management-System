
import React, { useState } from 'react';
import { useHospital } from '../HospitalContext';

const BookAppointmentModal = ({ onClose }: { onClose: () => void }) => {
  const { addAppointment, patients, doctors } = useHospital();
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = doctors.find(d => d.id === formData.doctorId);
    
    if (patient && doctor) {
      addAppointment({
        patientId: patient.id,
        patientName: patient.name,
        doctorName: doctor.name,
        department: doctor.specialty,
        date: formData.date,
        time: formData.time,
        status: 'Scheduled'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Select Patient</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Select Doctor</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Time</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 py-3 rounded-xl font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Schedule Visit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Appointments = () => {
  const { appointments, deleteAppointment } = useHospital();
  const [filter, setFilter] = useState('All');
  const [isBooking, setIsBooking] = useState(false);

  const handleDelete = (id: string) => {
    if(confirm('Cancel this appointment?')) {
      deleteAppointment(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500">Schedule and monitor patient visits efficiently.</p>
        </div>
        <button 
          onClick={() => setIsBooking(true)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-lg shadow-slate-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Book New Visit</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['All', 'Today', 'Upcoming', 'Completed'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              filter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400">
              No appointments scheduled.
            </div>
          ) : (
            appointments.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{app.patientName}</h4>
                    <p className="text-xs text-slate-400 font-medium">Visiting {app.doctorName} • {app.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">{app.time}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{app.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {app.status}
                    </span>
                    <button 
                      onClick={() => handleDelete(app.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Calendar</h3>
            <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 italic text-sm">
              Interactive Mini Calendar Placeholder
            </div>
          </div>
          <div className="bg-blue-600 p-6 rounded-2xl text-white">
            <h4 className="font-bold text-lg mb-2">Did you know?</h4>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              AI-assisted scheduling can reduce patient wait times by up to 35% during peak hours.
            </p>
            <button className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {isBooking && <BookAppointmentModal onClose={() => setIsBooking(false)} />}
    </div>
  );
};

export default Appointments;
