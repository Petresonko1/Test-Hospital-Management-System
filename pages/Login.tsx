
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHospital } from '../HospitalContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid clinical credentials. Please check your email/password.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.108.209A2 2 0 019.42 15.42l-1.42-1.42a2 2 0 010-2.828l1.42-1.42a2 2 0 012.828 0l1.42 1.42a2 2 0 010 2.828l-1.42 1.42z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Secure Access</h1>
          <p className="text-slate-400 mt-1 font-medium">Log in to the HealSync Clinical Panel</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-rose-100 flex items-center animate-in shake duration-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input 
              required 
              type="email" 
              autoComplete="email"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot?</button>
            </div>
            <input 
              required 
              type="password" 
              autoComplete="current-password"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700 font-medium"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Authenticating...</span>
              </div>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-400 font-medium text-sm">
            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register Now</Link>
          </p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-3">Live Developer Shortcuts</p>
            <div className="flex flex-wrap justify-center gap-2">
               <button onClick={() => {setEmail('admin@healsync.com'); setPassword('password123');}} className="text-[9px] bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold transition-colors border border-slate-100">ADMIN</button>
               <button onClick={() => {setEmail('doctor@healsync.com'); setPassword('password123');}} className="text-[9px] bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold transition-colors border border-slate-100">DOCTOR</button>
               <button onClick={() => {setEmail('patient@healsync.com'); setPassword('password123');}} className="text-[9px] bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold transition-colors border border-slate-100">PATIENT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
