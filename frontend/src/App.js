import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MonitoringBayi from './pages/MonitoringBayi';
import MonitoringDewasa from './pages/MonitoringDewasa';
import MonitoringLansia from './pages/MonitoringLansia';
import SemuaPasien from './pages/SemuaPasien';
import DetailPasien from './pages/DetailPasien';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring-bayi" element={<MonitoringBayi />} />
          <Route path="/monitoring-dewasa" element={<MonitoringDewasa />} />
          <Route path="/monitoring-lansia" element={<MonitoringLansia />} />
          <Route path="/semua-pasien" element={<SemuaPasien />} />
          <Route path="/detail-pasien/:id" element={<DetailPasien />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
