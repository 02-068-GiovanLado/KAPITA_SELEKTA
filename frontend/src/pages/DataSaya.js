import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import './DataSaya.css';

const DataSaya = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [nikInput, setNikInput] = useState('');
  const [showNikModal, setShowNikModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle pencarian nama
  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert('Masukkan nama yang ingin dicari');
      return;
    }

    setIsLoading(true);
    try {
      // Hanya kirim category filter ke backend, nama di-filter di frontend
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_BASE_URL}/patients`, {
        params: {
          category: selectedCategory !== 'Semua' ? selectedCategory : undefined
        }
      });

      console.log('Response from API:', response.data);
      console.log('Search keyword:', searchName);

      // Filter hasil berdasarkan nama yang mengandung keyword (di frontend)
      const filteredResults = response.data.filter(patient => 
        patient.name.toLowerCase().includes(searchName.toLowerCase())
      );

      console.log('Filtered results:', filteredResults);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching patients:', error);
      alert('Gagal melakukan pencarian. Pastikan backend berjalan di http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle klik tombol Lihat Detail
  const handleViewDetail = (patient) => {
    setSelectedPatient(patient);
    setShowNikModal(true);
    setNikInput('');
    setAuthError('');
  };

  // Handle verifikasi NIK
  const handleVerifyNik = async () => {
    if (!nikInput.trim()) {
      setAuthError('Masukkan NIK Anda');
      return;
    }

    // Untuk Bayi, gunakan NIK Ibu (mother_nik)
    // Untuk Dewasa, gunakan NIK pasien (nik)
    let validNik = null;
    let nikType = '';

    if (selectedPatient.category === 'Bayi') {
      validNik = selectedPatient.mother_nik;
      nikType = 'NIK Ibu';
      
      if (!validNik) {
        setAuthError('Data NIK Ibu untuk pasien ini belum terdaftar. Silakan hubungi admin untuk melengkapi data.');
        return;
      }
    } else {
      validNik = selectedPatient.nik;
      nikType = 'NIK';
      
      if (!validNik) {
        setAuthError('Data NIK untuk pasien ini belum terdaftar. Silakan hubungi admin untuk melengkapi data.');
        return;
      }
    }

    // Verifikasi NIK sesuai dengan data pasien
    if (nikInput === validNik) {
      // NIK valid, redirect ke halaman detail PUBLIC (bukan admin)
      setShowNikModal(false);
      navigate(`/public-detail-pasien/${selectedPatient.id}`);
    } else {
      setAuthError(`${nikType} tidak valid! Pastikan Anda memasukkan ${nikType} yang benar.`);
    }
  };

  return (
    <div className="datasaya-container">
      {/* White Header Navigation */}
      <div className="white-header">
        <div className="header-logo">
          <img src="/images/lampung-selatan-logo.png" alt="Logo Lampung Selatan" className="logo-icon" />
          <div className="logo-text">
            <h1>Sistem Kesehatan</h1>
            <h2>Tarahan</h2>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-link">Tentang Sistem</button>
          <button className="nav-link">Kebijakan Privasi</button>
          <button className="nav-link">Kebijakan Keamanan Informasi</button>
        </nav>
      </div>

      {/* Header */}
      <div className="datasaya-header">
        <div className="header-illustration">
          <div className="header-text">
            <h1>Informasi Kesehatan Terpadu Tarahan</h1>
          </div>
          <div className="header-image">
            <div className="illustration-person"></div>
          </div>
        </div>
      </div>

      {/* Search Bar dengan Dropdown Kategori */}
      <div className="search-section">
        <div className="search-container">
          <div className="category-dropdown">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Semua">Semua</option>
              <option value="Bayi">Bayi</option>
              <option value="Dewasa">Dewasa</option>
            </select>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Kata kunci: [Nama] [Jenis Kelamin] [Usia]"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={isLoading}>
              🔍
            </button>
          </div>
        </div>
        <p className="search-hint">
          💡 Ketik nama untuk melihat data umum. Untuk melihat detail lengkap, masukkan NIK Ibu (untuk Bayi) atau NIK Pasien (untuk Dewasa).
        </p>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>Hasil Pencarian Semua</h2>
          </div>
          
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Jenis Kelamin</th>
                  <th>Usia</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((patient) => (
                  <tr key={patient.id}>
                    <td className="patient-name">{patient.name}</td>
                    <td>
                      <span className={`category-badge ${patient.category.toLowerCase()}`}>
                        {patient.category}
                      </span>
                    </td>
                    <td>{patient.gender}</td>
                    <td>{patient.age}</td>
                    <td>
                      <button 
                        className="detail-link"
                        onClick={() => handleViewDetail(patient)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && searchName && !isLoading && (
        <div className="no-results">
          <p>❌ Tidak ada data ditemukan untuk "{searchName}"</p>
          <p>Pastikan nama yang Anda masukkan sudah terdaftar di sistem.</p>
        </div>
      )}

      {/* Modal NIK Authentication */}
      {showNikModal && (
        <div className="modal-overlay" onClick={() => setShowNikModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Verifikasi Identitas</h3>
              <button className="close-btn" onClick={() => setShowNikModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Untuk melihat data lengkap <strong>{selectedPatient?.name}</strong>, silakan masukkan NIK:</p>
              <input
                type="text"
                placeholder={selectedPatient?.category === 'Bayi' ? 'Masukkan NIK Ibu (16 digit)' : 'Masukkan NIK (16 digit)'}
                value={nikInput}
                onChange={(e) => setNikInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyNik()}
                maxLength="16"
                className={authError ? 'error' : ''}
              />
              {authError && <p className="error-message">❌ {authError}</p>}
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowNikModal(false)}>
                  Batal
                </button>
                <button className="verify-btn" onClick={handleVerifyNik}>
                  Verifikasi
                </button>
              </div>
              <p className="modal-hint">
                💡 {selectedPatient?.category === 'Bayi' 
                  ? 'NIK adalah Nomor Induk Kependudukan Ibu yang terdaftar saat pendaftaran'
                  : 'NIK adalah Nomor Induk Kependudukan yang terdaftar saat pendaftaran'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default DataSaya;
