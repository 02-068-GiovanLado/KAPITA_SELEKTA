import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SemuaPasien.css';

function SemuaPasien() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editCheckup, setEditCheckup] = useState({});
  const [editVitamins, setEditVitamins] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getPatients();
        setAllPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleEdit = async (patient) => {
    try {
      // Fetch full patient details including checkups and vitamins
      const fullPatient = await api.getPatientById(patient.id);
      setSelectedPatient(fullPatient);
      setEditForm(fullPatient);
      
      // Set latest checkup data
      if (fullPatient.checkups && fullPatient.checkups.length > 0) {
        setEditCheckup(fullPatient.checkups[0]);
      } else {
        setEditCheckup({});
      }
      
      // Set vitamins data
      if (fullPatient.vitamins && fullPatient.vitamins.length > 0) {
        setEditVitamins(fullPatient.vitamins);
      } else {
        setEditVitamins([]);
      }
      
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      alert('Gagal mengambil detail pasien');
    }
  };

  const handleDelete = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update patient data
      await api.updatePatient(selectedPatient.id, editForm);
      
      // Update checkup if exists
      if (editCheckup.id) {
        await api.updateCheckup(editCheckup.id, editCheckup);
      }
      
      // Update vitamins if exists
      for (const vitamin of editVitamins) {
        if (vitamin.id) {
          await api.updateVitamin(vitamin.id, vitamin);
        }
      }
      
      // Refresh data
      const data = await api.getPatients();
      setAllPatients(data);
      setShowEditModal(false);
      alert('Data pasien berhasil diupdate!');
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Gagal mengupdate data pasien');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deletePatient(selectedPatient.id);
      // Refresh data
      const data = await api.getPatients();
      setAllPatients(data);
      setShowDeleteModal(false);
      alert('Data pasien berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Gagal menghapus data pasien');
    }
  };

  const filteredPatients = activeTab === 'Semua' 
    ? allPatients 
    : allPatients.filter(p => p.category === activeTab);

  if (loading) return <div className="semua-pasien"><div className="loading">Loading...</div></div>;

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
        </div>

        <h2>Daftar Pasien</h2>
        <table className="patients-table">
          <thead>
            <tr>
              <th>NAMA</th>
              <th>KATEGORI</th>
              <th>STATUS KESEHATAN</th>
              <th>AKSI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
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
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(patient)}
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(patient)}
                      title="Hapus"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Data Pasien</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              {/* Informasi Pasien */}
              <h3 className="section-title">Informasi Pasien</h3>
              <div className="form-group">
                <label>Nama</label>
                <input 
                  type="text" 
                  value={editForm.name || ''} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required 
                />
              </div>
              
              {editForm.category === 'Bayi' ? (
                <>
                  <div className="form-group">
                    <label>Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={editForm.birth_date?.split('T')[0] || ''} 
                      onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Jenis Kelamin</label>
                    <select 
                      value={editForm.gender || ''} 
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      required
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nama Orang Tua</label>
                    <input 
                      type="text" 
                      value={editForm.guardian_name || ''} 
                      onChange={(e) => setEditForm({...editForm, guardian_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>NIK Ibu</label>
                    <input 
                      type="text" 
                      value={editForm.mother_nik || ''} 
                      onChange={(e) => setEditForm({...editForm, mother_nik: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>NIK Anak</label>
                    <input 
                      type="text" 
                      value={editForm.child_nik || ''} 
                      onChange={(e) => setEditForm({...editForm, child_nik: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>No Kartu Keluarga</label>
                    <input 
                      type="text" 
                      value={editForm.family_card_number || ''} 
                      onChange={(e) => setEditForm({...editForm, family_card_number: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Usia</label>
                    <input 
                      type="text" 
                      value={editForm.age || ''} 
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Jenis Kelamin</label>
                    <select 
                      value={editForm.gender || ''} 
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      required
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>NIK</label>
                    <input 
                      type="text" 
                      value={editForm.nik || ''} 
                      onChange={(e) => setEditForm({...editForm, nik: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              {/* Pemeriksaan Terakhir */}
              <h3 className="section-title">Pemeriksaan Terakhir</h3>
              {editCheckup.id ? (
                <>
                  <div className="form-group">
                    <label>Tanggal Pemeriksaan</label>
                    <input 
                      type="date" 
                      value={editCheckup.date?.split('T')[0] || ''} 
                      onChange={(e) => setEditCheckup({...editCheckup, date: e.target.value})}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Berat Badan (kg)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={editCheckup.weight || ''} 
                        onChange={(e) => setEditCheckup({...editCheckup, weight: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tinggi Badan (cm)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={editCheckup.height || ''} 
                        onChange={(e) => setEditCheckup({...editCheckup, height: e.target.value})}
                      />
                    </div>
                  </div>
                  {editForm.category === 'Bayi' && (
                    <div className="form-group">
                      <label>Lingkar Kepala (cm)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={editCheckup.head_circumference || ''} 
                        onChange={(e) => setEditCheckup({...editCheckup, head_circumference: e.target.value})}
                      />
                    </div>
                  )}
                  {editForm.category === 'Dewasa' && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tekanan Darah Sistolik</label>
                          <input 
                            type="number"
                            value={editCheckup.blood_pressure_systolic || ''} 
                            onChange={(e) => setEditCheckup({...editCheckup, blood_pressure_systolic: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tekanan Darah Diastolik</label>
                          <input 
                            type="number"
                            value={editCheckup.blood_pressure_diastolic || ''} 
                            onChange={(e) => setEditCheckup({...editCheckup, blood_pressure_diastolic: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Gula Darah (mg/dL)</label>
                          <input 
                            type="number"
                            value={editCheckup.blood_sugar || ''} 
                            onChange={(e) => setEditCheckup({...editCheckup, blood_sugar: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Kolesterol (mg/dL)</label>
                          <input 
                            type="number"
                            value={editCheckup.cholesterol || ''} 
                            onChange={(e) => setEditCheckup({...editCheckup, cholesterol: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Catatan</label>
                    <textarea 
                      rows="3"
                      value={editCheckup.notes || ''} 
                      onChange={(e) => setEditCheckup({...editCheckup, notes: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <p className="no-data-text">Belum ada data pemeriksaan</p>
              )}

              {/* Status Vitamin (hanya untuk Bayi) */}
              {editForm.category === 'Bayi' && editVitamins.length > 0 && (
                <>
                  <h3 className="section-title">Status Vitamin</h3>
                  {editVitamins.map((vitamin, index) => (
                    <div key={vitamin.id} className="vitamin-edit-item">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nama Vitamin</label>
                          <input 
                            type="text" 
                            value={vitamin.vitamin_name || ''} 
                            onChange={(e) => {
                              const newVitamins = [...editVitamins];
                              newVitamins[index].vitamin_name = e.target.value;
                              setEditVitamins(newVitamins);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tanggal</label>
                          <input 
                            type="date" 
                            value={vitamin.date?.split('T')[0] || ''} 
                            onChange={(e) => {
                              const newVitamins = [...editVitamins];
                              newVitamins[index].date = e.target.value;
                              setEditVitamins(newVitamins);
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select 
                          value={vitamin.status || ''} 
                          onChange={(e) => {
                            const newVitamins = [...editVitamins];
                            newVitamins[index].status = e.target.value;
                            setEditVitamins(newVitamins);
                          }}
                        >
                          <option value="Selesai">Selesai</option>
                          <option value="Terjadwal">Terjadwal</option>
                          <option value="Tertunda">Tertunda</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Konfirmasi Hapus</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menghapus data pasien <strong>{selectedPatient?.name}</strong>?</p>
              <p className="warning-text">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Batal
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteConfirm}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SemuaPasien;
