#!/bin/bash

# HealthMon Deployment Script
# Run this script on your production server

set -e  # Exit on error

echo "=================================="
echo "HealthMon Production Deployment"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Update system packages${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Install Node.js (v18)${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo -e "${YELLOW}Step 3: Install PostgreSQL${NC}"
apt install -y postgresql postgresql-contrib

echo -e "${YELLOW}Step 4: Install Nginx${NC}"
apt install -y nginx

echo -e "${YELLOW}Step 5: Install PM2${NC}"
npm install -g pm2

echo -e "${YELLOW}Step 6: Install Certbot (for SSL)${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}Step 7: Setup PostgreSQL Database${NC}"
sudo -u postgres psql <<EOF
CREATE DATABASE healthmon_db;
CREATE USER healthmon_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE healthmon_db TO healthmon_user;
\q
EOF

echo -e "${GREEN}System dependencies installed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository: git clone <your-repo>"
echo "2. Setup backend:"
echo "   cd backend"
echo "   npm install --production"
echo "   cp .env.production .env"
echo "   nano .env  # Edit with your production values"
echo "   npm run db:migrate"
echo "   pm2 start server.js --name healthmon-api"
echo ""
echo "3. Setup frontend:"
echo "   cd frontend"
echo "   npm install"
echo "   cp .env.production .env"
echo "   nano .env  # Edit with your production values"
echo "   npm run build"
echo "   sudo mkdir -p /var/www/healthmon/frontend"
echo "   sudo cp -r build/* /var/www/healthmon/frontend/build/"
echo ""
echo "4. Setup Nginx:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/healthmon"
echo "   sudo ln -s /etc/nginx/sites-available/healthmon /etc/nginx/sites-enabled/"
echo "   sudo nano /etc/nginx/sites-available/healthmon  # Edit domain name"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo ""
echo "5. Setup SSL:"
echo "   sudo certbot --nginx -d your-domain.com"
echo ""
echo "6. Save PM2 and set startup:"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo -e "${GREEN}Done! Check the logs if there are any issues.${NC}"
