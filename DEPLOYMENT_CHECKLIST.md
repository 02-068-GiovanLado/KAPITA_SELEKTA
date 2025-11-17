# HealthMon - Sistem Kesehatan Tarahan - Deployment Guide

## 📋 Checklist Sebelum Deploy

### 1. Security ✅ (SUDAH DIPERBAIKI)
- [x] CORS dikonfigurasi dengan whitelist domain
- [x] Environment variables tidak di-commit
- [x] URL hardcoded sudah diganti dengan env variables
- [ ] **CRITICAL**: Ganti hardcoded admin credentials di Login.js
- [ ] **RECOMMENDED**: Implementasi JWT authentication
- [ ] **RECOMMENDED**: Add rate limiting
- [ ] **RECOMMENDED**: Add input validation & sanitization

### 2. Configuration ✅
- [x] .env.example tersedia
- [x] CORS_ORIGIN configurable
- [x] Database credentials di env variables
- [x] .gitignore updated

### 3. Backend Preparation
- [x] Error handling middleware
- [x] Request logging
- [x] Health check endpoint
- [x] Graceful shutdown
- [ ] **TODO**: Add production logging (Winston/Morgan)
- [ ] **TODO**: Add API documentation (Swagger)

### 4. Frontend Preparation
- [x] Environment variables configured
- [x] API URL configurable
- [x] Build script available
- [ ] **TODO**: Add loading states
- [ ] **TODO**: Add error boundaries

---

## 🚀 Deployment Steps

### A. LOCAL TESTING (Development)

1. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials yang benar
npm run db:init  # Create database, migrate, and seed
npm start
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env jika perlu (default sudah benar untuk local)
npm start
```

### B. PRODUCTION DEPLOYMENT

#### Option 1: VPS/Cloud Server (Recommended)

**Backend:**
```bash
# 1. Install dependencies
npm install --production

# 2. Setup environment
cp .env.example .env
nano .env  # Edit dengan production values

# 3. Setup database
npm run db:migrate
npm run db:seed  # Optional: data dummy

# 4. Start with PM2
npm install -g pm2
pm2 start server.js --name healthmon-api
pm2 save
pm2 startup
```

**Frontend:**
```bash
# 1. Build production
npm run build

# 2. Serve with nginx atau apache
# Copy build/ folder ke web server
```

#### Option 2: Docker (Advanced)

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Option 3: Platform as a Service

**Vercel (Frontend):**
- Connect GitHub repo
- Set environment variables
- Deploy automatically

**Railway/Render (Backend):**
- Connect GitHub repo
- Set environment variables
- Add PostgreSQL database
- Deploy

---

## 🔧 Configuration for Production

### Backend (.env)
```env
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=healthmon_db
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

PORT=5000
NODE_ENV=production

CORS_ORIGIN=https://your-frontend-domain.com

ADMIN_USERNAME=admin_tarahan
ADMIN_PASSWORD=change-this-password
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_NAME=HealthMon Tarahan
REACT_APP_ENVIRONMENT=production
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/healthmon/build;
        try_files $uri /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ⚠️ CRITICAL ISSUES TO FIX BEFORE PRODUCTION

### 1. **Authentication System (HIGH PRIORITY)**
**Current Issue:** Hardcoded credentials di `frontend/src/pages/Login.js`

**Solution A - Quick Fix (Gunakan env):**
```javascript
// Login.js
const adminUser = process.env.REACT_APP_ADMIN_USERNAME || 'admin_tarahan';
const adminPass = process.env.REACT_APP_ADMIN_PASSWORD || 'admin_tarahan123';

if (username === adminUser && password === adminPass) {
  // login
}
```

**Solution B - Proper (Backend Authentication):**
```javascript
// Backend: Create /api/auth/login endpoint
// Frontend: Send credentials to backend
// Backend: Verify and return JWT token
// Frontend: Store token and use for API requests
```

### 2. **Input Validation**
Add validation di backend untuk semua input:
```javascript
const { body, validationResult } = require('express-validator');

router.post('/patients', [
  body('name').notEmpty().trim(),
  body('age').isNumeric(),
  // ... validasi lainnya
], patientController.createPatient);
```

### 3. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

### 4. **Security Headers**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check backend
curl http://your-domain.com/health

# Check database connection
npm run test-db
```

### Logs
```bash
# PM2 logs
pm2 logs healthmon-api

# System logs
tail -f /var/log/nginx/error.log
```

### Backup Database
```bash
pg_dump healthmon_db > backup_$(date +%Y%m%d).sql
```

---

## 📝 Post-Deployment Checklist

- [ ] Test all features di production
- [ ] Verify database connections
- [ ] Check CORS settings
- [ ] Test admin login
- [ ] Test CRUD operations
- [ ] Verify API endpoints
- [ ] Check responsive design
- [ ] Test on different browsers
- [ ] Setup SSL certificate (HTTPS)
- [ ] Configure domain name
- [ ] Setup automated backups
- [ ] Configure monitoring alerts

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs healthmon-api

# Check database connection
psql -U postgres -d healthmon_db

# Check port
netstat -tulpn | grep 5000
```

### Frontend not connecting to backend
1. Check REACT_APP_API_URL di .env
2. Check CORS_ORIGIN di backend .env
3. Check network tab di browser DevTools

### Database errors
```bash
# Reset database
npm run db:reset

# Run migrations
npm run db:migrate
```

---

## 📞 Support
Untuk issues atau pertanyaan, check dokumentasi di:
- API_DOCUMENTATION.md
- FRONTEND_INTEGRATION.md
- DEPLOYMENT.md
