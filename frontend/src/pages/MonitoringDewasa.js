import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MonitoringDewasa.css';

function MonitoringDewasa() {
  const [dewasaPatients, setDewasaPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getPatients('Dewasa');
        setDewasaPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="monitoring-dewasa"><div className="loading">Loading...</div></div>;

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
