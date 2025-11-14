import React from 'react';
import { Link } from 'react-router-dom';
import { getPatientsByCategory } from '../data/mockData';
import './MonitoringDewasa.css';

function MonitoringDewasa() {
  const dewasaPatients = getPatientsByCategory('Dewasa');

  return (
    <div className="monitoring-dewasa">
      <div className="page-header">
        <h1>Monitoring Dewasa</h1>
        <div className="user-avatar"></div>
      </div>

      <div className="patients-card">
        <h2>Pasien Dewasa</h2>
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
            {dewasaPatients.map(patient => (
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

export default MonitoringDewasa;
