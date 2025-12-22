
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import AIAssistant from './pages/AIAssistant';
import { HospitalProvider } from './HospitalContext';

const App: React.FC = () => {
  return (
    <HospitalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </Layout>
      </Router>
    </HospitalProvider>
  );
};

export default App;
