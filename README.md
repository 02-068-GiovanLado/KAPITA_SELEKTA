# HealthMon - Sistem Monitoring Kesehatan

Sistem monitoring kesehatan lengkap untuk memantau pasien bayi, dewasa, dan lansia dengan dashboard interaktif dan REST API backend.

## 📁 Struktur Proyek

Proyek ini terdiri dari dua aplikasi terpisah:

```
health/
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # API integration layer
│   │   └── data/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/           # Node.js REST API
│   ├── models/        # Sequelize models
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── migrations/    # Database migrations
│   ├── seeders/       # Demo data
│   ├── scripts/       # Google Sheets sync
│   ├── config/        # Database config
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── README.md          # Dokumentasi utama (file ini)
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm atau yarn

### 1️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database
createdb healthmon_db

# Copy environment file
copy .env.example .env

# Edit .env dengan kredensial database Anda
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=healthmon_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run migrations
npm run migrate

# Seed demo data (opsional)
npm run seed

# Start server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 2️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env (default sudah sesuai)
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🎯 Fitur Utama

### Frontend (React)
- ✅ Dashboard dengan statistik real-time
- ✅ Monitoring pasien berdasarkan kategori (Bayi, Dewasa, Lansia)
- ✅ Detail pasien dengan grafik kesehatan (Recharts)
- ✅ Filter dan pencarian pasien
- ✅ Responsive design
- ✅ API integration layer

### Backend (Node.js + Express)
- ✅ REST API dengan 5 endpoint
- ✅ PostgreSQL database dengan Sequelize ORM
- ✅ 5 model dengan relasi (Patient, Checkup, Alert, Immunization, Milestone)
- ✅ Database migrations & seeders
- ✅ Google Sheets synchronization
- ✅ CORS enabled untuk frontend integration
- ✅ Error handling & request logging

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/stats` | Statistik dashboard (total pasien per kategori) |
| GET | `/api/alerts/recent` | Alert terbaru dengan data pasien |
| GET | `/api/patients` | Daftar semua pasien (support filter ?category=...) |
| GET | `/api/patients/:id` | Detail pasien dengan checkups, alerts, immunizations, milestones |
| POST | `/api/patients` | Buat pasien baru dengan checkup awal (database transaction) |

Detail lengkap: Lihat `backend/API_DOCUMENTATION.md`

## 🗄️ Database Schema

**Tables:**
- `patients` - Data utama pasien (name, age, category, status)
- `checkups` - Riwayat pemeriksaan kesehatan
- `alerts` - Peringatan kesehatan
- `immunizations` - Data imunisasi (untuk bayi)
- `milestones` - Milestone perkembangan (untuk bayi)

**Relationships:**
- Patient hasMany Checkups, Alerts, Immunizations, Milestones
- All child tables belongsTo Patient

Lihat migrations di `backend/migrations/` untuk struktur lengkap.

## 🔄 Google Sheets Integration

Backend mendukung sinkronisasi data dari Google Sheets untuk input data massal.

**Setup:**
1. Buat Service Account di Google Cloud Console
2. Download JSON credentials
3. Share Google Sheet dengan email Service Account
4. Setup environment variables di backend/.env
5. Run: `npm run sync-sheet`

Detail lengkap: Lihat `backend/GOOGLE_SHEETS_SETUP.md`

## 🧪 Development Workflow

### Menjalankan Both Apps Simultaneously

**Terminal 1 (Backend):**
```bash
cd d:\health\backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd d:\health\frontend
npm start
```

### Database Management

```bash
cd backend

# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Create new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run seeders
npm run seed
```

## 📝 Dokumentasi Tambahan

- **Backend README**: `backend/README.md` - Setup lengkap backend
- **Frontend README**: `frontend/README.md` - Setup lengkap frontend
- **API Documentation**: `backend/API_DOCUMENTATION.md` - Spesifikasi API
- **Quick Start Guide**: `backend/QUICKSTART.md` - Panduan cepat backend
- **Google Sheets Setup**: `backend/GOOGLE_SHEETS_SETUP.md` - Integrasi Google Sheets
- **Frontend Integration**: `backend/FRONTEND_INTEGRATION.md` - Panduan integrasi
- **Deployment Guide**: `backend/DEPLOYMENT.md` - Panduan deployment

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Recharts 2.10.3
- CSS Modules

### Backend
- Node.js + Express 4.18.2
- PostgreSQL + Sequelize 6.35.2
- Google APIs 128.0.0
- CORS, dotenv, nodemon

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
# Build output di: frontend/build/
```

### Backend
```bash
cd backend
# Set NODE_ENV=production di .env
# Setup production database
npm run migrate
node server.js
```

Untuk deployment ke production (Heroku, AWS, dll), lihat `backend/DEPLOYMENT.md`.

## 🐛 Troubleshooting

**Backend tidak connect ke database:**
- Cek PostgreSQL service running
- Verifikasi kredensial di `.env`
- Pastikan database sudah dibuat: `createdb healthmon_db`

**Frontend tidak dapat fetch data:**
- Pastikan backend berjalan di port 5000
- Cek `REACT_APP_API_URL` di `frontend/.env`
- Buka Network tab di browser DevTools untuk debug

**CORS errors:**
- Backend sudah config CORS untuk localhost:3000
- Untuk production, update CORS origin di `backend/server.js`

## 📄 License

MIT License

## 👥 Contributors

Developed for health monitoring system.
