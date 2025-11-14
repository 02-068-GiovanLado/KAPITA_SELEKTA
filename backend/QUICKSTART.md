# HealthMon Backend - Quick Start Guide

Panduan cepat untuk memulai backend HealthMon dalam 5 menit.

## ⚡ Quick Setup

### 1. Install PostgreSQL

**Windows:**
```powershell
# Download dari https://www.postgresql.org/download/windows/
# Install dan catat password yang Anda set untuk user postgres
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Clone & Install

```bash
cd backend
npm install
```

### 3. Configure Environment

Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Edit `.env` dan set password PostgreSQL:
```env
DB_PASSWORD=your_postgres_password_here
```

### 4. Initialize Database

```bash
npm run db:init
```

Perintah ini akan:
- ✅ Membuat database `healthmon_db`
- ✅ Menjalankan semua migrasi (buat tabel)
- ✅ Mengisi data demo

### 5. Start Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` 🚀

### 6. Test API

Buka browser atau gunakan curl:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "message": "HealthMon API is running",
  "timestamp": "2023-11-14T10:00:00.000Z"
}
```

## 🧪 Test Endpoints

```bash
# Dashboard stats
curl http://localhost:5000/api/stats

# Recent alerts
curl http://localhost:5000/api/alerts/recent

# All patients
curl http://localhost:5000/api/patients

# Patients by category
curl http://localhost:5000/api/patients?category=Bayi

# Patient detail
curl http://localhost:5000/api/patients/1

# Create new patient
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "age": "6 bulan",
    "gender": "Laki-laki",
    "category": "Bayi",
    "guardian_name": "Guardian Name"
  }'
```

## 🎯 Common Commands

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Reset database (drop, create, migrate, seed)
npm run db:reset

# Run migrations only
npm run db:migrate

# Run seeders only
npm run db:seed

# Google Sheets sync
npm run sync:sheets
```

## 📊 Database Access

### Using psql (PostgreSQL CLI)

```bash
# Connect to database
psql -U postgres -d healthmon_db

# List all tables
\dt

# Query patients
SELECT * FROM patients;

# Exit
\q
```

### Using GUI Tools

Recommended tools:
- **pgAdmin** (https://www.pgadmin.org/)
- **DBeaver** (https://dbeaver.io/)
- **TablePlus** (https://tableplus.com/)

Connection details:
- Host: `localhost`
- Port: `5432`
- Database: `healthmon_db`
- User: `postgres`
- Password: (your password from .env)

## 🔍 Verify Setup

### 1. Check Database

```bash
psql -U postgres -d healthmon_db -c "SELECT COUNT(*) FROM patients;"
```

Should return: `count: 7`

### 2. Check Tables

```bash
psql -U postgres -d healthmon_db -c "\dt"
```

Should list:
- patients
- checkups
- alerts
- immunizations
- milestones

### 3. Check API Endpoints

```bash
# Should return stats
curl http://localhost:5000/api/stats

# Should return 7 patients
curl http://localhost:5000/api/patients | json_pp
```

## 🐛 Troubleshooting

### "database does not exist"

```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE healthmon_db;"

# Then run migrations
npm run db:migrate
npm run db:seed
```

### "password authentication failed"

Check your `.env` file - make sure `DB_PASSWORD` matches your PostgreSQL password.

### "Port 5000 already in use"

Change port in `.env`:
```env
PORT=5001
```

### "Cannot connect to database"

Check if PostgreSQL is running:
```bash
# Windows
pg_ctl status

# Mac/Linux
sudo service postgresql status
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Reset Everything

If something goes wrong, reset everything:

```bash
# Stop server (Ctrl+C)

# Drop database
psql -U postgres -c "DROP DATABASE IF EXISTS healthmon_db;"

# Reinitialize
npm run db:init

# Restart server
npm run dev
```

## 📱 Connect Frontend

Update frontend to connect to backend:

```javascript
// In React frontend
const API_URL = 'http://localhost:5000/api';

// Fetch patients
fetch(`${API_URL}/patients`)
  .then(res => res.json())
  .then(data => console.log(data));
```

**Note**: Make sure CORS is enabled (already configured in `server.js`)

## 📚 Next Steps

1. ✅ Backend running successfully
2. 📖 Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs
3. 🔄 Setup Google Sheets sync (optional): [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
4. 🎨 Connect your React frontend
5. 🚀 Deploy to production

## 💡 Pro Tips

1. **Use Nodemon**: Already configured with `npm run dev` for auto-reload
2. **Check Logs**: Server logs all requests - useful for debugging
3. **Test with Postman**: Import endpoints for easier testing
4. **Database Migrations**: Always use migrations, never modify database directly
5. **Environment Variables**: Never commit `.env` to git

## 📞 Need Help?

- Check [README.md](./README.md) for full documentation
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Review error logs in console
- Check PostgreSQL logs

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database created and migrated
- [ ] Demo data seeded
- [ ] Server running on port 5000
- [ ] All endpoints responding
- [ ] Can query database with psql

If all checked ✅, you're ready to go! 🎉
