# 🚀 Cara Menjalankan Aplikasi HealthMon

Panduan cepat untuk menjalankan frontend dan backend secara bersamaan.

## ✅ Prerequisites Checklist

- [ ] Node.js terinstall (versi 14 atau lebih baru)
- [ ] PostgreSQL terinstall dan running
- [ ] Dependencies frontend sudah ter-install (`cd frontend && npm install`)
- [ ] Dependencies backend sudah ter-install (`cd backend && npm install`)
- [ ] Database sudah dibuat (`createdb healthmon_db`)
- [ ] Migrations sudah dijalankan (`cd backend && npm run migrate`)
- [ ] Environment files sudah di-setup (`.env` di frontend dan backend)

## 📋 Langkah-langkah

### 1. Pastikan PostgreSQL Running

```powershell
# Cek status PostgreSQL
Get-Service -Name postgresql*

# Jika belum running, start service
Start-Service postgresql-x64-XX  # sesuaikan dengan versi Anda
```

### 2. Jalankan Backend (Terminal 1)

```powershell
# Buka terminal PowerShell pertama
cd d:\health\backend

# Jalankan server dalam mode development
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
Database connected: healthmon_db
```

✅ Backend ready di: `http://localhost:5000`

### 3. Jalankan Frontend (Terminal 2)

```powershell
# Buka terminal PowerShell kedua (jangan tutup terminal pertama)
cd d:\health\frontend

# Jalankan React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view healthmon in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ Frontend ready di: `http://localhost:3000`

Browser akan otomatis membuka aplikasi!

## 🧪 Testing

### Test Backend API

Buka browser atau Postman dan test endpoint:

```
GET http://localhost:5000/api/stats
GET http://localhost:5000/api/patients
GET http://localhost:5000/api/patients/1
GET http://localhost:5000/api/alerts/recent
```

### Test Frontend

1. Buka `http://localhost:3000`
2. Navigasi ke halaman Dashboard
3. Coba klik menu sidebar (Monitoring Bayi, Dewasa, Lansia)
4. Klik "Lihat Detail" pada salah satu pasien
5. Coba tab "Semua Pasien"

## 🛑 Stopping Applications

### Stop Frontend
```
Press Ctrl+C in Terminal 2
Y (untuk konfirmasi)
```

### Stop Backend
```
Press Ctrl+C in Terminal 1
```

## 🔄 Restart Aplikasi

Jika perlu restart (setelah perubahan code):

**Backend (auto-restart dengan nodemon):**
- Simpan file → nodemon akan restart otomatis
- Atau `Ctrl+C` dan `npm run dev` lagi

**Frontend:**
- React hot reload otomatis saat save file
- Jika error, `Ctrl+C` dan `npm start` lagi

## 🐛 Common Issues

### Port 3000 sudah digunakan
```
? Something is already running on port 3000.
Would you like to run the app on another port instead? (Y/n)
```
Ketik `Y` untuk menggunakan port lain (misalnya 3001)

### Port 5000 sudah digunakan
```powershell
# Cari process yang menggunakan port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill process (ganti PID dengan nomor dari command di atas)
Stop-Process -Id PID -Force
```

### Database connection error
```powershell
cd backend

# Cek database exists
psql -U postgres -l

# Jika belum ada, create database
createdb healthmon_db

# Run migrations lagi
npm run migrate
```

### CORS Error di Frontend Console
- Pastikan backend running di port 5000
- Cek `REACT_APP_API_URL` di `frontend/.env`
- Restart frontend: `Ctrl+C` → `npm start`

## 📊 Quick Commands Reference

| Task | Command | Directory |
|------|---------|-----------|
| Start Backend | `npm run dev` | `backend/` |
| Start Frontend | `npm start` | `frontend/` |
| Reset Database | `npm run migrate:undo && npm run migrate` | `backend/` |
| Seed Data | `npm run seed` | `backend/` |
| Build Frontend | `npm run build` | `frontend/` |
| Sync Google Sheet | `npm run sync-sheet` | `backend/` |

## 🎉 Success!

Jika kedua aplikasi berjalan tanpa error:
- ✅ Backend API: `http://localhost:5000/api`
- ✅ Frontend Dashboard: `http://localhost:3000`
- ✅ Database: Connected ke `healthmon_db`

Anda siap untuk development! 🚀
