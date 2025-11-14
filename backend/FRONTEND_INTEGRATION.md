# Frontend Integration Guide

Panduan untuk mengintegrasikan React frontend dengan backend API.

## 🔌 Setup API Connection

### 1. Create API Service File

Buat file `src/services/api.js` di frontend:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // GET request helper
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // POST request helper
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Dashboard Stats
  async getStats() {
    return this.get('/stats');
  }

  // Recent Alerts
  async getRecentAlerts() {
    return this.get('/alerts/recent');
  }

  // Get All Patients
  async getPatients(category = null) {
    const query = category ? `?category=${category}` : '';
    return this.get(`/patients${query}`);
  }

  // Get Patient by ID
  async getPatientById(id) {
    return this.get(`/patients/${id}`);
  }

  // Create Patient
  async createPatient(patientData) {
    return this.post('/patients', patientData);
  }
}

export default new ApiService();
```

### 2. Update Environment Variables

Buat/update `.env` di root frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Update Mock Data to Real API

### Dashboard Component

**Before (with mock data):**
```javascript
import { getDashboardStats, patientsData, getRecentAlerts } from '../data/mockData';

function Dashboard() {
  const stats = getDashboardStats();
  const recentAlerts = getRecentAlerts();
  // ...
}
```

**After (with real API):**
```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, patientsData, alertsData] = await Promise.all([
          api.getStats(),
          api.getPatients(),
          api.getRecentAlerts()
        ]);
        
        setStats(statsData);
        setPatients(patientsData);
        setRecentAlerts(alertsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="dashboard">
      {/* Stats cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-label">Total Pasien</div>
        </div>
        {/* ... other stat cards */}
      </div>

      {/* Patients table */}
      <div className="patients-section">
        <h2>Daftar Pasien</h2>
        <table className="patients-table">
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.category}</td>
                <td>
                  <span className={`status-badge ${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent alerts */}
      <div className="alerts-section">
        <h2>Peringatan Terbaru</h2>
        {recentAlerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <strong>{alert.patient.name}</strong>: {alert.description}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Monitoring Bayi Component

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function MonitoringBayi() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBabyPatients = async () => {
      try {
        const data = await api.getPatients('Bayi');
        setPatients(data);
      } catch (err) {
        console.error('Error fetching baby patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBabyPatients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="monitoring-bayi">
      <h1>Monitoring Bayi</h1>
      <table className="patients-table">
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>
                <Link to={`/detail-pasien/${patient.id}`}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Detail Pasien Component

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DetailPasien() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await api.getPatientById(id);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  // Transform checkups data for chart
  const chartData = patient.checkups.map(checkup => ({
    date: new Date(checkup.date).toLocaleDateString(),
    weight: parseFloat(checkup.weight),
    height: parseFloat(checkup.height)
  }));

  return (
    <div className="detail-pasien">
      <h1>Detail Pasien</h1>
      
      <div className="patient-info">
        <h2>{patient.name}</h2>
        <p>Usia: {patient.age}</p>
        <p>Kategori: {patient.category}</p>
        <p>Status: {patient.status}</p>
      </div>

      {/* Checkups chart for babies */}
      {patient.category === 'Bayi' && chartData.length > 0 && (
        <div className="chart-section">
          <h2>Kurva Pertumbuhan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Berat (kg)" />
              <Line type="monotone" dataKey="height" stroke="#82ca9d" name="Tinggi (cm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Immunizations */}
      {patient.immunizations && patient.immunizations.length > 0 && (
        <div className="immunizations">
          <h2>Riwayat Imunisasi</h2>
          <ul>
            {patient.immunizations.map(imm => (
              <li key={imm.id}>
                {imm.vaccine_name} - {imm.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alerts */}
      {patient.alerts && patient.alerts.length > 0 && (
        <div className="alerts">
          <h2>Peringatan</h2>
          {patient.alerts.map(alert => (
            <div key={alert.id} className={`alert ${alert.alert_type}`}>
              {alert.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Create Patient Form

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreatePatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Laki-laki',
    category: 'Bayi',
    guardian_name: '',
    nik: '',
    checkup: {
      weight: '',
      height: '',
      head_circumference: '',
      blood_pressure: '',
      blood_sugar: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('checkup.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        checkup: { ...prev.checkup, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const patient = await api.createPatient(formData);
      navigate(`/detail-pasien/${patient.id}`);
    } catch (err) {
      setError(err.message);
      console.error('Error creating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-patient">
      <h1>Tambah Pasien Baru</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Usia:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g., 8 bulan, 35 tahun"
            required
          />
        </div>

        <div className="form-group">
          <label>Jenis Kelamin:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kategori:</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Bayi">Bayi</option>
            <option value="Dewasa">Dewasa</option>
            <option value="Lansia">Lansia</option>
          </select>
        </div>

        {formData.category === 'Bayi' && (
          <div className="form-group">
            <label>Nama Wali:</label>
            <input
              type="text"
              name="guardian_name"
              value={formData.guardian_name}
              onChange={handleChange}
            />
          </div>
        )}

        {(formData.category === 'Dewasa' || formData.category === 'Lansia') && (
          <div className="form-group">
            <label>NIK:</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
            />
          </div>
        )}

        <h3>Data Pemeriksaan Awal</h3>

        <div className="form-group">
          <label>Berat Badan (kg):</label>
          <input
            type="number"
            step="0.1"
            name="checkup.weight"
            value={formData.checkup.weight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tinggi Badan (cm):</label>
          <input
            type="number"
            step="0.1"
            name="checkup.height"
            value={formData.checkup.height}
            onChange={handleChange}
          />
        </div>

        {formData.category === 'Bayi' && (
          <div className="form-group">
            <label>Lingkar Kepala (cm):</label>
            <input
              type="number"
              step="0.1"
              name="checkup.head_circumference"
              value={formData.checkup.head_circumference}
              onChange={handleChange}
            />
          </div>
        )}

        {(formData.category === 'Dewasa' || formData.category === 'Lansia') && (
          <>
            <div className="form-group">
              <label>Tekanan Darah:</label>
              <input
                type="text"
                name="checkup.blood_pressure"
                value={formData.checkup.blood_pressure}
                onChange={handleChange}
                placeholder="e.g., 120/80"
              />
            </div>

            <div className="form-group">
              <label>Gula Darah (mg/dL):</label>
              <input
                type="number"
                name="checkup.blood_sugar"
                value={formData.checkup.blood_sugar}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Pasien'}
        </button>
      </form>
    </div>
  );
}
```

## 🎨 Loading & Error States

Create reusable components:

```javascript
// components/Loading.js
export const Loading = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// components/ErrorMessage.js
export const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <p className="error-message">Error: {message}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);
```

## 🔄 Auto-Refresh Data

For real-time updates:

```javascript
useEffect(() => {
  const fetchData = async () => {
    // fetch data...
  };

  fetchData();
  
  // Refresh every 30 seconds
  const interval = setInterval(fetchData, 30000);
  
  return () => clearInterval(interval);
}, []);
```

## 🚀 Next Steps

1. Replace all mock data imports with API calls
2. Add loading states to all pages
3. Add error handling
4. Test all endpoints
5. Add form validation
6. Implement error recovery
7. Add offline support (optional)

## 📝 Notes

- Backend must be running before frontend
- Check CORS configuration if having issues
- Use React DevTools to debug state
- Monitor Network tab for API calls
- Add authentication later if needed
