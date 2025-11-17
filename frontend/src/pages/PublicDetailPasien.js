import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from '../components/Footer';
import './PublicDetailPasien.css';

const PublicDetailPasien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatientDetail = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_BASE_URL}/patients/${id}`);
      setPatient(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBackToHome = () => {
    navigate('/data-saya');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!patient) {
    return <div className="error">Data pasien tidak ditemukan</div>;
  }

  // Prepare chart data
  const latestCheckups = patient.checkups ? patient.checkups.slice(0, 10).reverse() : [];
  
  const chartData = latestCheckups.map(c => ({
    date: new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    weight: c.weight,
    height: c.height
  }));

  return (
    <div className="public-detail-container" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Header dengan logo dan tombol kembali */}
      <div className="public-header">
        <div className="header-content" style={{ padding: '1.5rem 2rem', maxWidth: '100%' }}>
          <div className="header-left">
            <img src="/images/lampung-selatan-logo.png" alt="Logo" className="header-logo" />
            <div className="header-title">
              <h1>Sistem Kesehatan Tarahan</h1>
              <p>Lampung Selatan</p>
            </div>
          </div>
          <button className="back-button" onClick={handleBackToHome}>
            ← Kembali ke Beranda
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="public-content" style={{ padding: '2rem', maxWidth: '100%', margin: '0 auto' }}>
        <h2 className="page-title" style={{ marginBottom: '1.5rem' }}>Detail Pasien</h2>

        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', width: '100%' }}>
          {/* Left Column */}
          <div className="left-column">
            {/* Informasi Pasien */}
            <div className="info-card">
              <h3>Informasi Pasien</h3>
              <div className="info-grid">
                {patient.category === 'Bayi' ? (
                  <>
                    <div className="info-item">
                      <span className="info-label">Nama Anak</span>
                      <span className="info-value">{patient.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Jenis Kelamin</span>
                      <span className="info-value">{patient.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tanggal Lahir</span>
                      <span className="info-value">
                        {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Usia</span>
                      <span className="info-value">{patient.age}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nama Orang Tua</span>
                      <span className="info-value">{patient.guardian_name || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">NIK Ibu</span>
                      <span className="info-value">{patient.mother_nik || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">NIK Anak</span>
                      <span className="info-value">{patient.child_nik || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">No Kartu Keluarga</span>
                      <span className="info-value">{patient.family_card_number || '-'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <span className="info-label">Nama</span>
                      <span className="info-value">{patient.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Jenis Kelamin</span>
                      <span className="info-value">{patient.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Usia</span>
                      <span className="info-value">{patient.age}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">NIK</span>
                      <span className="info-value">{patient.nik || '-'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pemeriksaan Terakhir */}
            {patient.checkups && patient.checkups.length > 0 && (
              <div className="checkup-card">
                <h3>Pemeriksaan Terakhir</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Tanggal</span>
                    <span className="info-value">
                      {new Date(patient.checkups[0].date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {patient.checkups[0].weight && (
                    <div className="info-item">
                      <span className="info-label">Berat Badan</span>
                      <span className="info-value">{patient.checkups[0].weight} kg</span>
                    </div>
                  )}
                  {patient.checkups[0].height && (
                    <div className="info-item">
                      <span className="info-label">Tinggi Badan</span>
                      <span className="info-value">{patient.checkups[0].height} cm</span>
                    </div>
                  )}
                  {patient.checkups[0].head_circumference && (
                    <div className="info-item">
                      <span className="info-label">Lingkar Kepala</span>
                      <span className="info-value">{patient.checkups[0].head_circumference} cm</span>
                    </div>
                  )}
                  {patient.checkups[0].blood_pressure && (
                    <div className="info-item">
                      <span className="info-label">Tekanan Darah</span>
                      <span className="info-value">{patient.checkups[0].blood_pressure}</span>
                    </div>
                  )}
                  {patient.checkups[0].blood_sugar && (
                    <div className="info-item">
                      <span className="info-label">Gula Darah</span>
                      <span className="info-value">{patient.checkups[0].blood_sugar} mg/dL</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Kurva Pertumbuhan */}
            {latestCheckups.length > 0 && (
              <div className="chart-card">
                <h3>Kurva Pertumbuhan</h3>
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

            {/* Status Vitamin */}
            {patient.vitamins && patient.vitamins.length > 0 && (
              <div className="vitamin-card">
                <h3>Status Vitamin</h3>
                <div className="vitamin-list">
                  {patient.vitamins.slice(0, 5).map((vitamin, index) => (
                    <div key={index} className="vitamin-item">
                      <div className="vitamin-info">
                        <span className="vitamin-name">{vitamin.vitamin_name}</span>
                        <span className="vitamin-date">
                          {new Date(vitamin.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <span className={`vitamin-status ${vitamin.status.toLowerCase()}`}>
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
      
      <Footer />
    </div>
  );
};

export default PublicDetailPasien;
