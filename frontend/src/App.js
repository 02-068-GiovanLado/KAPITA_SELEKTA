import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MonitoringBayi from './pages/MonitoringBayi';
import MonitoringDewasa from './pages/MonitoringDewasa';
import SemuaPasien from './pages/SemuaPasien';
import DetailPasien from './pages/DetailPasien';
import DataSaya from './pages/DataSaya';
import PublicDetailPasien from './pages/PublicDetailPasien';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect ke Data Saya */}
        <Route path="/" element={<Navigate to="/data-saya" replace />} />
        
        {/* Public Routes - No Layout */}
        <Route path="/data-saya" element={<DataSaya />} />
        <Route path="/public-detail-pasien/:id" element={<PublicDetailPasien />} />
        
        {/* Login Route - No Protection */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Routes - With Layout dan Protection */}
        <Route path="/admin" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/monitoring-bayi" element={<ProtectedRoute><Layout><MonitoringBayi /></Layout></ProtectedRoute>} />
        <Route path="/admin/monitoring-dewasa" element={<ProtectedRoute><Layout><MonitoringDewasa /></Layout></ProtectedRoute>} />
        <Route path="/admin/semua-pasien" element={<ProtectedRoute><Layout><SemuaPasien /></Layout></ProtectedRoute>} />
        <Route path="/admin/detail-pasien/:id" element={<ProtectedRoute><Layout><DetailPasien /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
