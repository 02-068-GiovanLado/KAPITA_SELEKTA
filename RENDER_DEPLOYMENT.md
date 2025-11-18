# 🚀 Panduan Deploy ke Render

Panduan lengkap untuk deploy Health Monitoring System ke Render dengan PostgreSQL.

## 📋 Prerequisites

- Akun GitHub (project sudah push ke GitHub)
- Akun Render (gratis): https://render.com
- Git installed

---

## 🎯 Langkah-Langkah Deployment

### 1️⃣ Setup PostgreSQL Database

1. Login ke [Render Dashboard](https://dashboard.render.com)
2. Klik **"New +"** → Pilih **"PostgreSQL"**
3. Isi form:
   - **Name**: `health-monitoring-db`
   - **Database**: `health_monitoring`
   - **User**: (otomatis di-generate)
   - **Region**: `Singapore` (terdekat dengan Indonesia)
   - **Plan**: `Free`
4. Klik **"Create Database"**
5. **PENTING**: Simpan kredensial database:
   - Internal Database URL
   - External Database URL
   - PSQL Command

### 2️⃣ Deploy Backend API

1. Klik **"New +"** → Pilih **"Web Service"**
2. Connect GitHub repository Anda
3. Pilih repository: `KAPITA_SELEKTA`
4. Isi form:
   - **Name**: `health-monitoring-api`
   - **Region**: `Singapore`
   - **Branch**: `gio` (atau `main`)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npx sequelize-cli db:migrate
     ```
   - **Start Command**: 
     ```bash
     node server.js
     ```
   - **Plan**: `Free`

5. **Environment Variables** - Klik "Advanced" dan tambahkan:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[Paste dari step 1 - Internal Database URL]
   JWT_SECRET=[Generate random string 32 karakter]
   TELEGRAM_BOT_TOKEN=[Your bot token jika ada]
   TELEGRAM_CHAT_ID=[Your chat ID jika ada]
   N8N_WEBHOOK_URL=[Your webhook URL jika ada]
   ```

6. Klik **"Create Web Service"**
7. Tunggu build selesai (~5-10 menit)
8. **Simpan URL Backend**: `https://health-monitoring-api.onrender.com`

### 3️⃣ Deploy Frontend

1. Klik **"New +"** → Pilih **"Static Site"**
2. Connect GitHub repository yang sama
3. Isi form:
   - **Name**: `health-monitoring-frontend`
   - **Region**: `Singapore`
   - **Branch**: `gio` (atau `main`)
   - **Root Directory**: `frontend`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://health-monitoring-api.onrender.com
   ```

5. Klik **"Create Static Site"**
6. Tunggu build selesai (~3-5 menit)
7. **URL Frontend**: `https://health-monitoring-frontend.onrender.com`

---

## 🔧 Konfigurasi Tambahan

### A. Setup Database Manual (Jika Migrasi Gagal)

1. Buka database di Render Dashboard
2. Klik tab **"Connect"**
3. Copy **PSQL Command**
4. Install PostgreSQL client lokal atau gunakan online tool
5. Jalankan migrasi manual:
   ```bash
   npx sequelize-cli db:migrate --url "DATABASE_URL_DARI_RENDER"
   ```

### B. Seed Data Demo (Optional)

Jika ingin data demo:
```bash
npx sequelize-cli db:seed:all --url "DATABASE_URL_DARI_RENDER"
```

### C. Enable Auto-Deploy

Render otomatis deploy saat push ke GitHub:
- Setiap push ke branch `gio` akan auto-deploy
- Cek status di Dashboard → Service → "Events" tab

---

## 🔒 Keamanan & Environment Variables

### Generate JWT_SECRET

Gunakan salah satu cara:
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Online
# Kunjungi: https://randomkeygen.com/
```

### Update Environment Variables

1. Masuk ke Service → "Environment"
2. Klik variable yang ingin diubah
3. Update value
4. Service akan auto-restart

---

## 📊 Monitoring & Logs

### Cek Logs Backend
1. Dashboard → `health-monitoring-api`
2. Tab **"Logs"** → Real-time logs
3. Tab **"Metrics"** → CPU, Memory usage

### Cek Logs Database
1. Dashboard → `health-monitoring-db`
2. Tab **"Info"** → Connection stats
3. Tab **"Logs"** → Query logs

### Health Check
Backend otomatis punya health check:
```
https://health-monitoring-api.onrender.com/api/health
```

---

## 🐛 Troubleshooting

### ❌ Build Failed - Backend

**Error**: `Module not found`
```bash
# Pastikan semua dependencies di package.json
npm install --save <missing-package>
git add . && git commit -m "Add missing dependencies"
git push
```

**Error**: Migration failed
```bash
# Check DATABASE_URL format
postgresql://user:password@host:5432/database

# Run manual migration via Render Shell:
# Dashboard → Service → "Shell" tab
npx sequelize-cli db:migrate
```

### ❌ Build Failed - Frontend

**Error**: `REACT_APP_API_URL is undefined`
```bash
# Pastikan env var sudah diset
# Dashboard → frontend service → Environment
# Add: REACT_APP_API_URL=https://health-monitoring-api.onrender.com
```

**Error**: Build out of memory
```bash
# Upgrade plan atau optimize build:
# Tambahkan di package.json:
"build": "GENERATE_SOURCEMAP=false react-scripts build"
```

### ❌ CORS Error

Update `backend/server.js` - pastikan origin benar:
```javascript
const corsOptions = {
  origin: [
    'https://health-monitoring-frontend.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### ❌ Database Connection Error

1. Cek DATABASE_URL format (harus pakai Internal URL)
2. Pastikan database masih aktif (free tier bisa sleep)
3. Restart backend service

### ⚠️ Free Tier Limitations

**Backend:**
- Service sleep setelah 15 menit tidak aktif
- Cold start bisa 30-50 detik
- 750 jam/bulan (cukup untuk 1 service 24/7)

**Database:**
- 256MB storage (cukup untuk ratusan pasien)
- 90 hari expiry (backup data secara berkala)
- Max 1GB RAM

**Frontend:**
- 100GB bandwidth/bulan
- Unlimited requests
- CDN global gratis

---

## 🔄 Update Aplikasi

### Update Code
```bash
# Di local
git add .
git commit -m "Update feature X"
git push origin gio

# Render akan auto-deploy dalam 2-3 menit
```

### Update Environment Variables
1. Dashboard → Service → "Environment"
2. Edit variable
3. Save (auto-restart)

### Manual Redeploy
1. Dashboard → Service
2. Klik "Manual Deploy" → "Clear build cache & deploy"

---

## 💡 Tips & Best Practices

### 1. Custom Domain (Optional - Gratis)
```
Dashboard → Service → "Settings" → "Custom Domain"
Add: yourdomain.com
Update DNS records sesuai instruksi
```

### 2. Backup Database Otomatis
```bash
# Install pg_dump lokal
# Setup cron job untuk backup berkala:
pg_dump "$(render postgres url)" > backup_$(date +%Y%m%d).sql
```

### 3. Monitoring Eksternal
- Setup UptimeRobot (gratis) untuk ping setiap 5 menit
- Mencegah cold start pada jam sibuk
- Alert jika service down

### 4. Environment-Specific Config
```javascript
// backend/config/config.js
module.exports = {
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
```

---

## 🎉 Selesai!

Aplikasi Anda sekarang live di:
- **Frontend**: https://health-monitoring-frontend.onrender.com
- **Backend API**: https://health-monitoring-api.onrender.com
- **Database**: PostgreSQL hosted di Render

### Test Aplikasi
1. Buka frontend URL
2. Register akun baru
3. Login
4. Test create/read/update/delete data

---

## 📞 Support

Jika ada masalah:
1. Cek logs di Render Dashboard
2. Lihat Render Docs: https://render.com/docs
3. Render Community: https://community.render.com

---

## 📝 Checklist Deployment

- [ ] Database PostgreSQL created
- [ ] Database credentials saved
- [ ] Backend deployed successfully
- [ ] Backend environment variables configured
- [ ] Backend health check passing
- [ ] Frontend deployed successfully
- [ ] Frontend API URL configured
- [ ] Test login/register
- [ ] Test CRUD operations
- [ ] Monitor logs untuk errors
- [ ] Setup UptimeRobot (optional)
- [ ] Custom domain (optional)

**Deployment Date**: _________
**Frontend URL**: _________
**Backend URL**: _________
**Database**: _________

---

**🎊 Selamat! Aplikasi Anda sudah live dan siap digunakan!**
