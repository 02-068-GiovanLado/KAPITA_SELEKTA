# HealthMon Backend API

Backend API untuk aplikasi HealthMon (Health Monitoring Dashboard) menggunakan Node.js, Express, PostgreSQL, dan Sequelize.

## 🚀 Teknologi

- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **Google Sheets API** - Untuk sinkronisasi data massal

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

## 🔧 Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasinya:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthmon_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Google Sheets Configuration (optional - untuk sync feature)
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 3. Setup Database

Buat database dan jalankan migrasi serta seeder:

```bash
# Membuat database
npm run db:create

# Menjalankan migrasi untuk membuat tabel
npm run db:migrate

# Mengisi database dengan data demo
npm run db:seed

# Atau gunakan perintah all-in-one
npm run db:init
```

### 4. Menjalankan Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Base URL: `/api`

#### 1. **GET /api/stats**
Mengambil statistik dashboard

**Response:**
```json
{
  "totalPatients": 7,
  "totalBabies": 3,
  "totalAdults": 2,
  "totalElders": 2,
  "activeAlerts": 3
}
```

#### 2. **GET /api/alerts/recent**
Mengambil 5 peringatan terbaru dengan detail pasien

**Response:**
```json
[
  {
    "id": 1,
    "alertType": "Kritis",
    "description": "Tekanan darah sangat tinggi (165/100 mmHg).",
    "createdAt": "2023-11-14T10:00:00.000Z",
    "patient": {
      "id": 3,
      "name": "Bambang Hartono",
      "category": "Lansia"
    }
  }
]
```

#### 3. **GET /api/patients**
Mengambil daftar semua pasien

**Query Parameters:**
- `category` (optional): Filter berdasarkan kategori (Bayi, Dewasa, Lansia)

**Example:**
```
GET /api/patients?category=Bayi
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ahmad Budi",
    "age": "8 bulan",
    "gender": "Laki-laki",
    "category": "Bayi",
    "status": "Stabil",
    ...
  }
]
```

#### 4. **GET /api/patients/:id**
Mengambil detail lengkap satu pasien beserta semua data terkait

**Response:**
```json
{
  "id": 1,
  "name": "Ahmad Budi",
  "age": "8 bulan",
  "category": "Bayi",
  "checkups": [...],
  "alerts": [...],
  "immunizations": [...],
  "milestones": [...]
}
```

#### 5. **POST /api/patients**
Membuat pasien baru dengan pemeriksaan awal

**Request Body:**
```json
{
  "name": "John Doe",
  "age": "6 bulan",
  "gender": "Laki-laki",
  "category": "Bayi",
  "guardian_name": "Jane Doe",
  "status": "Stabil",
  "checkup": {
    "weight": 7.5,
    "height": 65.0,
    "head_circumference": 42.0
  }
}
```

**Response:**
```json
{
  "id": 8,
  "name": "John Doe",
  ...
}
```

## 🔄 Sinkronisasi Google Sheets

Fitur ini memungkinkan Anda mengimpor data massal dari Google Sheets ke database.

### Setup Google Service Account

1. Buat project di [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Sheets API
3. Buat Service Account dan download JSON key
4. Share Google Sheets Anda dengan email service account
5. Copy kredensial ke file `.env`

### Format Google Sheets

Buat tabs berikut di spreadsheet Anda:

- **patients**: id, name, age, gender, category, nik, guardian_name, last_checkup_date, status
- **checkups**: id, patient_id, date, weight, height, head_circumference, blood_pressure, blood_sugar
- **alerts**: id, patient_id, alert_type, description
- **immunizations**: id, patient_id, vaccine_name, status, date
- **milestones**: id, patient_id, milestone_name, achieved, date

### Menjalankan Sync

```bash
npm run sync:sheets
```

Script akan:
- Membaca data dari semua tabs
- Melakukan upsert (update jika ada, insert jika baru)
- Menampilkan progress dan hasil sync

## 📁 Struktur Proyek

```
backend/
├── config/
│   ├── config.js           # Sequelize config
│   └── database.js         # Database connection
├── controllers/
│   └── patientController.js # Business logic
├── migrations/
│   ├── *-create-patients.js
│   ├── *-create-checkups.js
│   └── ...
├── models/
│   ├── index.js            # Model associations
│   ├── Patient.js
│   ├── Checkup.js
│   └── ...
├── routes/
│   └── api.js              # API routes
├── scripts/
│   └── syncFromSheet.js    # Google Sheets sync
├── seeders/
│   ├── *-demo-patients.js
│   └── ...
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .sequelizerc            # Sequelize CLI config
├── package.json
├── server.js               # Express server
└── README.md
```

## 🗄️ Database Schema

### Tables

1. **patients** - Data pasien
2. **checkups** - Riwayat pemeriksaan
3. **alerts** - Peringatan kesehatan
4. **immunizations** - Status imunisasi (untuk bayi)
5. **milestones** - Milestone perkembangan (untuk bayi)

### Relationships

- Patient `hasMany` Checkups, Alerts, Immunizations, Milestones
- Checkup, Alert, Immunization, Milestone `belongsTo` Patient

## 🛠️ NPM Scripts

```bash
npm start              # Jalankan server production
npm run dev            # Jalankan server development (dengan nodemon)
npm run db:create      # Buat database
npm run db:migrate     # Jalankan migrasi
npm run db:seed        # Isi data demo
npm run db:reset       # Reset database (drop, create, migrate, seed)
npm run db:init        # Initialize database (create, migrate, seed)
npm run sync:sheets    # Sinkronisasi dari Google Sheets
```

## 🔒 Keamanan

- Gunakan environment variables untuk kredensial
- Jangan commit file `.env` ke repository
- Gunakan HTTPS di production
- Validasi input di semua endpoint
- Gunakan prepared statements (Sequelize ORM)

## 🚨 Troubleshooting

### Database Connection Error

```bash
# Pastikan PostgreSQL berjalan
sudo service postgresql status

# Cek kredensial di .env
# Cek apakah database sudah dibuat
```

### Migration Error

```bash
# Reset semua migrasi
npm run db:reset
```

### Google Sheets Sync Error

- Pastikan Service Account email sudah diberikan akses ke spreadsheet
- Cek format private key di .env (harus ada `\n` untuk newline)
- Pastikan Sheet ID benar

## 📝 Catatan Penting

1. **Transaksi Database**: Endpoint POST /patients menggunakan transaksi untuk memastikan data konsisten
2. **Upsert Logic**: Script sync menggunakan `bulkCreate` dengan `updateOnDuplicate` untuk upsert
3. **Association Loading**: Gunakan `include` untuk eager loading relasi
4. **Indexing**: Tabel sudah memiliki index untuk performa query optimal

## 🤝 Contributing

Jika ingin berkontribusi:
1. Fork repository
2. Buat branch baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

ISC

## 👥 Author

HealthMon Development Team
