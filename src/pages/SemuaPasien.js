import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { patientsData } from '../data/mockData';
import './SemuaPasien.css';

function SemuaPasien() {
  const [activeTab, setActiveTab] = useState('Semua');

  const filteredPatients = activeTab === 'Semua' 
    ? patientsData 
    : patientsData.filter(p => p.kategori === activeTab);

  return (
    <div className="semua-pasien">
      <div className="page-header">
        <h1>Daftar Semua Pasien</h1>
        <div className="user-avatar"></div>
      </div>

      <div className="patients-card">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'Semua' ? 'active' : ''}`}
            onClick={() => setActiveTab('Semua')}
          >
            Semua
          </button>
          <button 
            className={`tab ${activeTab === 'Bayi' ? 'active' : ''}`}
            onClick={() => setActiveTab('Bayi')}
          >
            Bayi
          </button>
          <button 
            className={`tab ${activeTab === 'Dewasa' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dewasa')}
          >
            Dewasa
          </button>
          <button 
            className={`tab ${activeTab === 'Lansia' ? 'active' : ''}`}
            onClick={() => setActiveTab('Lansia')}
          >
            Lansia
          </button>
        </div>

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
            {filteredPatients.map(patient => (
              <tr key={patient.id}>
                <td>
                  <div className="patient-name">
                    <strong>{patient.nama}</strong>
                    <span className="patient-age">{patient.usia}</span>
                  </div>
                </td>
                <td>{patient.kategori}</td>
                <td>
                  <span className={`status-badge ${patient.statusKesehatan.toLowerCase().replace(' ', '-')}`}>
                    {patient.statusKesehatan}
                  </span>
                </td>
                <td>
                  <Link to={`/detail-pasien/${patient.id}`} className="view-detail">
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
    </div>
  );
}

export default SemuaPasien;
