# HealthMon - Health Monitoring Dashboard

Website monitoring kesehatan pasien untuk bayi, dewasa, dan lansia.

## Fitur

- **Dashboard**: Tampilan ringkasan statistik pasien dan peringatan kesehatan terbaru
- **Monitoring Bayi**: Daftar pasien bayi dengan status kesehatan
- **Monitoring Dewasa**: Daftar pasien dewasa dengan status kesehatan
- **Monitoring Lansia**: Daftar pasien lansia dengan status kesehatan
- **Detail Pasien**: Informasi lengkap pasien dengan grafik pertumbuhan/tren kesehatan
- **Semua Pasien**: Daftar lengkap semua pasien dengan filter kategori

## Teknologi

- React 18.2.0
- React Router DOM 6.20.0 untuk navigasi
- Recharts 2.10.3 untuk visualisasi data
- CSS modules untuk styling

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env sesuai kebutuhan
# REACT_APP_API_URL=http://localhost:5000/api
```

3. Jalankan aplikasi:
```bash
npm start
```

4. Buka browser di `http://localhost:3000`

## Build Production

```bash
npm run build
```

## Struktur Folder

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Komponen reusable (Layout)
│   │   ├── Layout.js
│   │   └── Layout.css
│   ├── pages/          # Halaman aplikasi
│   │   ├── Dashboard.js
│   │   ├── MonitoringBayi.js
│   │   ├── MonitoringDewasa.js
│   │   ├── MonitoringLansia.js
│   │   ├── DetailPasien.js
│   │   └── SemuaPasien.js
│   ├── services/       # API integration
│   │   └── api.js
│   ├── data/           # Mock data (akan diganti dengan API)
│   │   └── mockData.js
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── .env                # Environment variables
├── .env.example        # Template environment variables
├── .gitignore
├── package.json
└── README.md
```

## Integrasi dengan Backend

Frontend ini dirancang untuk bekerja dengan backend Node.js yang tersedia di `../backend/`.

### API Service

File `src/services/api.js` menyediakan method untuk:
- `getStats()` - Statistik dashboard
- `getRecentAlerts()` - Alert terbaru
- `getPatients(category)` - Daftar pasien (opsional filter kategori)
- `getPatientById(id)` - Detail pasien
- `createPatient(data)` - Membuat pasien baru

### Mengganti Mock Data dengan API

Untuk mengintegrasikan dengan backend, ganti import di file pages:

```javascript
// Sebelum (menggunakan mock data)
import { patients, alerts } from '../data/mockData';

// Sesudah (menggunakan API)
import api from '../services/api';

// Contoh penggunaan:
useEffect(() => {
  async function fetchData() {
    try {
      const stats = await api.getStats();
      const alerts = await api.getRecentAlerts();
      // Update state dengan data dari API
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  fetchData();
}, []);
```

## Menjalankan Full Stack

1. **Terminal 1 - Backend:**
```bash
cd d:\health\backend
npm run dev
```

2. **Terminal 2 - Frontend:**
```bash
cd d:\health\frontend
npm start
```

Backend: `http://localhost:5000` | Frontend: `http://localhost:3000`

## Screenshot

Aplikasi ini memiliki beberapa halaman utama:
- Dashboard dengan statistik dan tabel pasien
- Halaman monitoring untuk setiap kategori pasien
- Detail pasien dengan grafik dan informasi lengkap
- Halaman daftar semua pasien dengan tab filter
