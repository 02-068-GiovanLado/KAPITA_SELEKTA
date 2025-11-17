import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import './DetailPasien.css';

function DetailPasien() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-pasien">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="detail-pasien">
        <div className="page-header">
          <h1>Detail Pasien</h1>
        </div>
        <div className="not-found">Pasien tidak ditemukan</div>
      </div>
    );
  }

  const isBayi = patient.category === 'Bayi';
  
  // Sort checkups by date (oldest to newest for chart)
  const sortedCheckups = patient.checkups ? [...patient.checkups].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  ) : [];
  
  // Prepare chart data from checkups
  const chartData = sortedCheckups.map(checkup => ({
    date: new Date(checkup.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
    weight: checkup.weight,
    height: checkup.height,
    bloodPressureSys: checkup.blood_pressure ? parseInt(checkup.blood_pressure.split('/')[0]) : null,
    bloodSugar: checkup.blood_sugar
  }));
  
  // Get last checkup (most recent)
  const lastCheckup = patient.checkups?.[0] || {};

  return (
    <div className="detail-pasien">
      <div className="page-header">
        <h1>Detail Pasien</h1>
        <div className="user-avatar"></div>
      </div>

      <div className="detail-content">
        <div className="left-column">
          <div className="info-card">
            <h2>Informasi Pasien</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nama {isBayi ? 'Anak' : ''}</span>
                <span className="info-value">{patient.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Jenis Kelamin</span>
                <span className="info-value">{patient.gender}</span>
              </div>
              {isBayi && patient.birth_date && (
                <div className="info-item">
                  <span className="info-label">Tanggal Lahir</span>
                  <span className="info-value">{new Date(patient.birth_date).toLocaleDateString('id-ID')}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Usia</span>
                <span className="info-value">{patient.age}</span>
              </div>
              {isBayi && patient.guardian_name && (
                <div className="info-item">
                  <span className="info-label">Nama Orang Tua</span>
                  <span className="info-value">{patient.guardian_name}</span>
                </div>
              )}
              {isBayi && patient.mother_nik && (
                <div className="info-item">
                  <span className="info-label">NIK Ibu</span>
                  <span className="info-value">{patient.mother_nik}</span>
                </div>
              )}
              {isBayi && patient.child_nik && (
                <div className="info-item">
                  <span className="info-label">NIK Anak</span>
                  <span className="info-value">{patient.child_nik}</span>
                </div>
              )}
              {isBayi && patient.family_card_number && (
                <div className="info-item">
                  <span className="info-label">No Kartu Keluarga</span>
                  <span className="info-value">{patient.family_card_number}</span>
                </div>
              )}
              {!isBayi && patient.nik && (
                <div className="info-item">
                  <span className="info-label">NIK</span>
                  <span className="info-value">{patient.nik}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-card">
            <h2>Pemeriksaan Terakhir</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tanggal</span>
                <span className="info-value">
                  {lastCheckup.date ? new Date(lastCheckup.date).toLocaleDateString('id-ID') : 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Berat Badan</span>
                <span className="info-value">{lastCheckup.weight ? `${lastCheckup.weight} kg` : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tinggi Badan</span>
                <span className="info-value">{lastCheckup.height ? `${lastCheckup.height} cm` : 'N/A'}</span>
              </div>
              {isBayi && (
                <div className="info-item">
                  <span className="info-label">Lingkar Kepala</span>
                  <span className="info-value">{lastCheckup.head_circumference ? `${lastCheckup.head_circumference} cm` : 'N/A'}</span>
                </div>
              )}
              {!isBayi && (
                <>
                  <div className="info-item">
                    <span className="info-label">Tekanan Darah</span>
                    <span className="info-value">{lastCheckup.blood_pressure || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gula Darah</span>
                    <span className="info-value">{lastCheckup.blood_sugar ? `${lastCheckup.blood_sugar} mg/dL` : 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {patient.alerts && patient.alerts.length > 0 && (
            <div className="info-card">
              <h2>Peringatan Kesehatan</h2>
              <div className="alerts-list">
                {patient.alerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.alert_type.toLowerCase()}`}>
                    <div className="alert-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.alert_type}</div>
                      <div className="alert-message">{alert.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          {isBayi && chartData.length > 0 && (
            <div className="chart-card">
              <h2>Kurva Pertumbuhan</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8b5cf6" name="Berat (Kg)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="height" stroke="#10b981" name="Tinggi (cm)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {isBayi && patient.vitamins && patient.vitamins.length > 0 && (
            <div className="info-card">
              <h2>Status Vitamin</h2>
              <div className="immunization-list">
                {patient.vitamins.map((vitamin) => (
                  <div key={vitamin.id} className="immunization-item">
                    <div className="immunization-info">
                      <span className="immunization-name">{vitamin.vitamin_name}</span>
                      <span className="immunization-date">
                        {vitamin.date ? new Date(vitamin.date).toLocaleDateString('id-ID') : 'Belum terjadwal'}
                      </span>
                    </div>
                    <span className={`immunization-status ${vitamin.status.toLowerCase()}`}>
                      {vitamin.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPasien;
