# 🚂 Railway Deployment Guide - HealthMon

## ✅ Persiapan (SUDAH SELESAI)

- [x] Push code ke GitHub (branch: gio)
- [x] Railway config files dibuat
- [x] Procfile untuk backend
- [x] Package.json updated dengan serve

---

## 📝 Langkah Deployment ke Railway

### **1. Buat Account Railway**

1. Buka https://railway.app
2. Klik "Start a New Project"
3. Login dengan GitHub (recommended)
4. Authorize Railway untuk akses GitHub repos

### **2. Deploy Backend**

#### A. Create Backend Service

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository: `02-068-GiovanLado/KAPITA_SELEKTA`
4. Railway akan detect branch `gio`
5. Klik **"Add variables"** sebelum deploy

#### B. Setup Environment Variables (Backend)

Klik tab **"Variables"** dan tambahkan:

```env
NODE_ENV=production
PORT=5000

# Database (Railway akan auto-provide setelah add PostgreSQL)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_URL=${{Postgres.DATABASE_URL}}

# CORS - Akan diupdate setelah frontend deploy
CORS_ORIGIN=https://your-frontend-url.up.railway.app

# Admin Credentials
ADMIN_USERNAME=admin_tarahan123
ADMIN_PASSWORD=ChangeThisToStrongPassword123!

# Google Sheets (Opsional - jika pakai sync)
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY_ID=your-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id

# Telegram (Opsional)
TELEGRAM_BOT_TOKEN=your-bot-token
N8N_WEBHOOK_URL=your-n8n-webhook
```

#### C. Add PostgreSQL Database

1. Di project Railway, klik **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway akan auto-create database dan set environment variables
3. Variables `${{Postgres.xxx}}` akan otomatis ter-resolve

#### D. Configure Root Directory

1. Klik service backend
2. Klik tab **"Settings"**
3. Scroll ke **"Root Directory"**
4. Set ke: `backend`
5. Save

#### E. Deploy Backend

1. Klik tab **"Deployments"**
2. Railway akan auto-deploy
3. Tunggu hingga status: **"Success"** (≈2-3 menit)
4. Copy **"Public URL"** (contoh: `https://healthmon-backend.up.railway.app`)

---

### **3. Deploy Frontend**

#### A. Create Frontend Service

1. Di Railway project yang sama, klik **"New"** → **"GitHub Repo"**
2. Pilih repository yang sama: `KAPITA_SELEKTA`
3. Pilih branch: `gio`

#### B. Setup Environment Variables (Frontend)

Klik tab **"Variables"** dan tambahkan:

```env
NODE_ENV=production
REACT_APP_API_URL=https://healthmon-backend.up.railway.app/api

# Ganti dengan URL backend dari step 2.E
```

#### C. Configure Root Directory

1. Klik tab **"Settings"**
2. Set **"Root Directory"**: `frontend`
3. Set **"Build Command"**: `npm run build`
4. Set **"Start Command"**: `npx serve -s build -p $PORT`
5. Save

#### D. Deploy Frontend

1. Railway akan auto-deploy
2. Tunggu hingga **"Success"**
3. Copy **"Public URL"** frontend

---

### **4. Update CORS di Backend**

1. Kembali ke **Backend service**
2. Klik tab **"Variables"**
3. Update `CORS_ORIGIN` dengan URL frontend:
   ```
   CORS_ORIGIN=https://your-frontend-url.up.railway.app
   ```
4. Railway akan auto-redeploy backend

---

## 🧪 **5. Testing Deployment**

### Test Backend:
```bash
# Health check
curl https://healthmon-backend.up.railway.app/health

# Get stats
curl https://healthmon-backend.up.railway.app/api/stats

# Test login
curl -X POST https://healthmon-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_tarahan123","password":"YourPassword"}'
```

### Test Frontend:
1. Buka `https://your-frontend-url.up.railway.app`
2. Test halaman public: `/data-saya`
3. Test login admin: `/admin/login`
4. Test dashboard admin: `/admin/dashboard`

---

## 🔧 **Troubleshooting**

### Backend gagal start?
- Check **Logs** tab
- Pastikan root directory = `backend`
- Pastikan PostgreSQL sudah ter-connect
- Check DATABASE_URL variable ada

### Frontend blank page?
- Check **Logs** tab
- Pastikan `REACT_APP_API_URL` benar (harus include `/api`)
- Check CORS di backend sudah update dengan URL frontend
- Hard refresh browser (Ctrl+Shift+R)

### Database migration gagal?
- Di Railway backend service, klik **"Deployments"** tab
- Klik **"View Logs"**
- Cari error migration
- Manual run migration:
  1. Railway dashboard → Backend service
  2. Klik **"Settings"** → **"Deploy Trigger"**
  3. Atau via Railway CLI: `railway run npm run db:migrate`

### 404 Not Found di API calls?
- Pastikan frontend `REACT_APP_API_URL` include `/api`
- Example: `https://backend.railway.app/api` (BENAR)
- Bukan: `https://backend.railway.app` (SALAH)

---

## 💰 **Railway Pricing**

- **Free tier:** $5 credit/bulan
- **Usage:**
  - Backend: ~$2-3/bulan
  - Frontend: ~$1-2/bulan  
  - PostgreSQL: Included dalam usage
- **Estimasi:** Bisa gratis selama ~2-3 bulan dengan $5 credit

Setelah credit habis, bisa upgrade ke:
- **Developer Plan:** $5/bulan (includes $5 credit)
- **Hobby Plan:** $20/bulan (includes $20 credit)

---

## 🎯 **Checklist Final**

- [ ] Backend deployed & running
- [ ] PostgreSQL connected
- [ ] Migrations executed successfully
- [ ] Frontend deployed
- [ ] CORS updated dengan frontend URL
- [ ] Test login admin berhasil
- [ ] Test public pages berfungsi
- [ ] Custom domain setup (opsional)

---

## 📱 **Custom Domain (Opsional)**

Jika punya domain sendiri (contoh: healthmon-tarahan.com):

1. Railway Backend:
   - Settings → Domains → Add Custom Domain
   - Add: `api.healthmon-tarahan.com`
   - Copy CNAME record
   - Add di DNS provider Anda

2. Railway Frontend:
   - Settings → Domains → Add Custom Domain
   - Add: `healthmon-tarahan.com`
   - Copy CNAME record
   - Add di DNS provider

3. Update Variables:
   - Backend `CORS_ORIGIN` → `https://healthmon-tarahan.com`
   - Frontend `REACT_APP_API_URL` → `https://api.healthmon-tarahan.com/api`

---

## 🚀 **Next Steps**

Setelah deploy berhasil:

1. **Seed data** (jika perlu):
   ```bash
   # Via Railway CLI
   railway run npm run db:seed
   ```

2. **Setup monitoring:**
   - Railway provides automatic logs
   - Check "Metrics" tab untuk usage

3. **Setup backups:**
   - PostgreSQL data di Railway auto-backup
   - Export manual via Railway dashboard

4. **Update credentials:**
   - Ganti `ADMIN_PASSWORD` dengan password kuat
   - Rotate secrets jika diperlukan

---

**Butuh bantuan deploy sekarang? Saya siap guide step-by-step! 🚂**
