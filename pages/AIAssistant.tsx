
import React, { useState } from 'react';
import { getSymptomsAnalysis } from '../services/geminiService';

const AIAssistant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    const analysis = await getSymptomsAnalysis(symptoms);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-block p-3 bg-blue-100 rounded-2xl text-blue-600 mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">HealSync AI Clinical Assistant</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Input patient symptoms to receive preliminary analysis and suggested medical departments.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Describe Symptoms</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[150px]"
                placeholder="Example: Patient reports acute abdominal pain on the right side, accompanied by low-grade fever and nausea for 6 hours..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-slate-50 border-t border-slate-200 p-8 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-start space-x-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Preliminary Assessment</h3>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    result.urgencyLevel === 'Emergency' ? 'bg-rose-500 text-white' : 
                    result.urgencyLevel === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    Urgency: {result.urgencyLevel}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {result.analysis}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {result.suggestedDepartments.map((dept: string, i: number) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-100 shadow-sm">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-slate-400 text-xs italic">
              <strong>Disclaimer:</strong> This tool is intended for clinical assistance and internal triaging only. It does not provide medical diagnoses or treatment plans. Always consult with a licensed medical professional.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
