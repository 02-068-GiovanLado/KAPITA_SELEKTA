import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({ totalPasien: 0, totalBayi: 0, totalDewasa: 0 });
  const [patients, setPatients] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, patientsData, alertsData] = await Promise.all([
          api.getStats(),
          api.getPatients(),
          api.getRecentAlerts()
        ]);
        
        // Map backend field names to frontend
        setStats({
          totalPasien: statsData.totalPatients || 0,
          totalBayi: statsData.totalBabies || 0,
          totalDewasa: statsData.totalAdults || 0,
          peringatanAktif: statsData.activeAlerts || 0
        });
        setPatients(patientsData);
        setRecentAlerts(alertsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data. Pastikan backend server running.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="user-avatar"></div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Pasien</div>
            <div className="stat-value">{stats.totalPasien}</div>
          </div>
          <div className="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Bayi</div>
            <div className="stat-value">{stats.totalBayi}</div>
          </div>
          <div className="stat-icon pink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Dewasa</div>
            <div className="stat-value">{stats.totalDewasa}</div>
          </div>
          <div className="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Peringatan Aktif</div>
            <div className="stat-value">{stats.peringatanAktif}</div>
          </div>
          <div className="stat-icon red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="patients-section">
          <h2>Daftar Pasien</h2>
          <table className="patients-table">
            <thead>
              <tr>
                <th>NAMA</th>
                <th>KATEGORI</th>
                <th>STATUS KESEHATAN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 10).map(patient => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-name">
                      <strong>{patient.name}</strong>
                      <span className="patient-age">{patient.age}</span>
                    </div>
                  </td>
                  <td>{patient.category}</td>
                  <td>
                    <span className={`status-badge ${patient.status?.toLowerCase().replace(' ', '-') || 'stabil'}`}>
                      {patient.status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/detail-pasien/${patient.id}`} className="view-detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="alerts-section">
          <h2>Peringatan Terbaru</h2>
          <div className="alerts-list">
            {recentAlerts.map((alert, index) => (
              <div key={index} className={`alert-item ${alert.alert_type?.toLowerCase() || 'perhatian'}`}>
                <div className="alert-icon">
                  {alert.alert_type === 'Kritis' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div className="alert-content">
                  <div className="alert-title">
                    <strong>{alert.Patient?.name || 'Unknown'}</strong> ({alert.Patient?.category || 'N/A'})
                  </div>
                  <div className="alert-message">{alert.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
