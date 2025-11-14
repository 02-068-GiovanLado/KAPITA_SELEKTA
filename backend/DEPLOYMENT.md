# HealthMon Backend - Deployment Guide

Panduan deployment backend ke berbagai platform production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] CORS configured for production domain
- [ ] Security headers added
- [ ] Rate limiting implemented (optional)
- [ ] Logging configured
- [ ] Error handling tested
- [ ] Database backup strategy in place

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for beginners)

#### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

#### 2. Login to Heroku
```bash
heroku login
```

#### 3. Create Heroku App
```bash
cd backend
heroku create healthmon-api
```

#### 4. Add PostgreSQL Add-on
```bash
heroku addons:create heroku-postgresql:mini
```

#### 5. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
# Add other env vars as needed
```

#### 6. Deploy
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### 7. Run Migrations
```bash
heroku run npm run db:migrate
heroku run npm run db:seed
```

#### 8. Open App
```bash
heroku open
```

**Heroku Specific Files:**

Create `Procfile` in backend root:
```
web: node server.js
```

---

### Option 2: Railway

#### 1. Sign up at [Railway.app](https://railway.app)

#### 2. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 3. Login
```bash
railway login
```

#### 4. Initialize Project
```bash
cd backend
railway init
```

#### 5. Add PostgreSQL
```bash
railway add postgresql
```

#### 6. Set Environment Variables
```bash
railway variables set NODE_ENV=production
```

#### 7. Deploy
```bash
railway up
```

---

### Option 3: DigitalOcean App Platform

#### 1. Sign up at [DigitalOcean](https://www.digitalocean.com/)

#### 2. Create New App
- Connect GitHub repository
- Select backend folder
- Configure build and run commands

#### 3. Add Database
- Add PostgreSQL database component
- Link to app

#### 4. Configure Environment Variables
Add in App Platform dashboard:
- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Other environment variables

#### 5. Deploy
- App Platform will auto-deploy on git push

---

### Option 4: VPS (Ubuntu/Debian)

#### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Setup PostgreSQL

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE healthmon_db;
CREATE USER healthmon_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE healthmon_db TO healthmon_user;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> healthmon-backend
cd healthmon-backend/backend

# Install dependencies
sudo npm install --production

# Create .env file
sudo nano .env
# Add all environment variables

# Run migrations
npm run db:migrate
npm run db:seed
```

#### 4. Setup PM2

```bash
# Start app with PM2
pm2 start server.js --name healthmon-api

# Save PM2 config
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/healthmon-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/healthmon-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### 7. Setup Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 🔒 Production Security

### 1. Environment Variables

Never commit `.env` file. Use platform-specific environment variable management.

### 2. Update CORS Configuration

In `server.js`, update CORS for production:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'  // Your frontend domain
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 3. Add Security Headers

Install helmet:
```bash
npm install helmet
```

Update `server.js`:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Add Rate Limiting

Install express-rate-limit:
```bash
npm install express-rate-limit
```

Update `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Enable HTTPS

Always use HTTPS in production. Use Let's Encrypt for free SSL certificates.

---

## 📊 Monitoring & Logging

### 1. Setup Logging

Install winston:
```bash
npm install winston
```

Create `config/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

### 2. Monitor with PM2

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs healthmon-api

# View metrics
pm2 describe healthmon-api
```

### 3. Setup Health Checks

Already implemented at `/health` endpoint. Monitor it with:
- UptimeRobot
- Pingdom
- StatusCake

---

## 🗄️ Database Management

### 1. Automated Backups

Create backup script `scripts/backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/healthmon"
mkdir -p $BACKUP_DIR

pg_dump -U healthmon_user healthmon_db > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

### 2. Migration Strategy

Always test migrations in staging first:
```bash
# Staging
npm run db:migrate

# Production (after testing)
heroku run npm run db:migrate  # Heroku
# or
ssh user@server "cd /var/www/healthmon-backend/backend && npm run db:migrate"
```

---

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend
        npm install
    
    - name: Run tests
      run: |
        cd backend
        npm test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "healthmon-api"
        heroku_email: "your-email@example.com"
        appdir: "backend"
```

---

## 📈 Performance Optimization

### 1. Enable Compression

```bash
npm install compression
```

In `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching

For GET endpoints that don't change often:
```javascript
const cache = require('express-cache-middleware');
app.use('/api/stats', cache({ duration: 5 * 60 * 1000 })); // 5 minutes
```

### 3. Database Connection Pooling

Already configured in Sequelize. Adjust pool size if needed:
```javascript
// config/database.js
pool: {
  max: 10,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

---

## 🔍 Troubleshooting Production Issues

### Check Logs
```bash
# Heroku
heroku logs --tail

# PM2
pm2 logs healthmon-api

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Issues
- Check firewall rules
- Verify database credentials
- Check connection pool settings
- Verify database is running

### High Memory Usage
- Check for memory leaks
- Restart with PM2: `pm2 restart healthmon-api`
- Increase server resources

### Slow Queries
- Check database indexes
- Use `EXPLAIN` in PostgreSQL
- Add more indexes if needed
- Consider caching

---

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Update dependencies
- [ ] Monthly: Database backup verification
- [ ] Quarterly: Security audit
- [ ] Quarterly: Load testing

### Update Dependencies
```bash
npm outdated
npm update
npm audit fix
```

---

## ✅ Post-Deployment Checklist

- [ ] API is accessible via HTTPS
- [ ] All endpoints responding correctly
- [ ] Database connected and migrations run
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] SSL certificate valid
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Logs accessible
- [ ] Health check endpoint working
- [ ] Frontend can connect to API
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Documentation updated with production URLs

---

## 🎉 You're Live!

Your backend is now running in production. Monitor it regularly and keep it updated!

For issues, check logs first, then documentation, then create an issue in your repository.
