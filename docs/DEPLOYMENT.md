# Deployment Guide

Complete guide for deploying the Express Production Starter to production environments.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Production Checklist](#production-checklist)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Scaling Strategies](#scaling-strategies)

---

## 🎯 Prerequisites

### **System Requirements**
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **RAM**: Minimum 2GB, Recommended 8GB+
- **CPU**: Minimum 2 cores, Recommended 4+ cores
- **Storage**: Minimum 10GB SSD
- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows Server

### **Optional Services**
- **Redis**: For Bull queues (recommended for production)
- **Nginx**: As reverse proxy (recommended)
- **PM2**: Process manager (recommended)
- **SSL Certificate**: For HTTPS (required)

---

## ⚙️ Environment Configuration

### **1. Production Environment Variables**

Create `.env` file with production settings:

```bash
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=3001
ENABLE_CLUSTER=true
WORKERS=4
WORKER_50=false
BASE_URL=https://api.yourdomain.com

# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_production_db
DB_USER=your_db_user
DB_PASSWORD=your_strong_db_password
DB_SSL=true
DB_POOL_MAX=120

# ============================================
# SECURITY CONFIGURATION
# ============================================
JWT_SECRET=generate-a-very-strong-random-secret-minimum-64-characters-long
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# ============================================
# CORS CONFIGURATION
# ============================================
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# ============================================
# EMAIL CONFIGURATION
# ============================================
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM="Your App <noreply@yourdomain.com>"

# ============================================
# FEATURE FLAGS
# ============================================
ENABLE_CSP=true
ENABLE_CORS=true
ENABLE_CSRF=true
ENABLE_SECURITY_MW=true
ENABLE_RATE_LIMIT=true
ENABLE_CRON=true
ENABLE_SLOW_QUERY_LOG=true
ENABLE_SYSTEM_HEALTH_LOG=true
ENABLE_API_TRACKING=true
ENABLE_IMAGE_COMPRESSION=true
ENABLE_SWAGGER=false
ENABLE_COMPRESSION=true

# ============================================
# RATE LIMITING
# ============================================
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=5

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info
```

### **2. Generate Strong Secrets**

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate database password
openssl rand -base64 32
```

---

## 🗄️ Database Setup

### **1. PostgreSQL Installation**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **2. Database Configuration**

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE your_production_db;

# Create user
CREATE USER your_db_user WITH PASSWORD 'your_strong_db_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE your_production_db TO your_db_user;

# Exit
\q
```

### **3. Run Migrations**

```bash
# Install dependencies
npm install --production

# Run migrations
npm run migrate

# Verify tables
psql -U your_db_user -d your_production_db -c "\dt"
```

---

## 📦 Deployment Options

### **Option 1: PM2 (Recommended)**

**1. Install PM2**
```bash
npm install -g pm2
```

**2. Create PM2 Config**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'production-backend',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

**3. Start Application**
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

**4. PM2 Commands**
```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart
pm2 restart production-backend

# Stop
pm2 stop production-backend

# Monitor
pm2 monit
```

### **Option 2: Docker**

**1. Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs/application logs/database logs/system logs/api

# Build static assets if needed
# RUN npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
```

**2. Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    restart: unless-stopped

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=your_production_db
      - POSTGRES_USER=your_db_user
      - POSTGRES_PASSWORD=your_db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

**3. Deploy with Docker**
```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npm run migrate

# View logs
docker-compose logs -f app
```

### **Option 3: Systemd**

**1. Create Service File**
```bash
sudo nano /etc/systemd/system/production-backend.service
```

**2. Service Configuration**
```ini
[Unit]
Description=Production Backend
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/production-backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=production-backend
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

**3. Enable and Start**
```bash
sudo systemctl daemon-reload
sudo systemctl enable production-backend
sudo systemctl start production-backend
sudo systemctl status production-backend
```

---

## 🔒 Security Considerations

### **1. Firewall Setup**

**UFW (Ubuntu):**
```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow application port (if not behind proxy)
sudo ufw allow 3001

# Enable firewall
sudo ufw enable
```

### **2. Nginx Reverse Proxy**

**1. Install Nginx**
```bash
sudo apt install nginx
```

**2. Create Config**
```bash
sudo nano /etc/nginx/sites-available/production-backend
```

**3. Nginx Configuration**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File uploads
    location /uploads {
        alias /home/deploy/production-backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**4. Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/production-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **3. SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring & Maintenance

### **1. Log Rotation**

Create `/etc/logrotate.d/production-backend`:
```
/home/deploy/production-backend/logs/*/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reload production-backend
    endscript
}
```

### **2. Health Checks**

```bash
# Create health check script
cat > /home/deploy/health-check.sh << 'EOF'
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ $response != "200" ]; then
    echo "Health check failed with status $response"
    pm2 restart production-backend
fi
EOF

chmod +x /home/deploy/health-check.sh

# Add to crontab (every 5 minutes)
echo "*/5 * * * * /home/deploy/health-check.sh" | crontab -
```

### **3. Database Backups**

```bash
# Create backup script
cat > /home/deploy/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U your_db_user -d your_production_db > $BACKUP_DIR/db_backup_$DATE.sql

# Keep last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
EOF

chmod +x /home/deploy/backup-db.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /home/deploy/backup-db.sh" | crontab -
```

---

## 📈 Scaling Strategies

### **1. Horizontal Scaling**

**Multiple Servers:**
- Use load balancer (Nginx, HAProxy)
- Shared database (PostgreSQL replication)
- Shared storage (NFS, S3)
- Redis cluster for sessions/caching

### **2. Vertical Scaling**

**Single Server Optimization:**
- Increase RAM/CPU
- Use SSD storage
- Optimize database (indexes, queries)
- Enable caching (Redis)

### **3. Database Scaling**

**Read Replicas:**
```javascript
// In db.js
const readReplica = new Sequelize({
  host: process.env.DB_READ_REPLICA_HOST,
  // ... other config
});

const writeDb = new Sequelize({
  host: process.env.DB_HOST,
  // ... other config
});
```

---

## ✅ Production Checklist

### **Before Going Live**

- [ ] Environment variables configured
- [ ] Strong secrets generated
- [ ] Database created and migrated
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Nginx reverse proxy set up
- [ ] PM2/Systemd service configured
- [ ] Log rotation configured
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Error notifications configured
- [ ] Rate limits tested
- [ ] Security headers verified
- [ ] CORS configured correctly
- [ ] File permissions set correctly

### **After Deployment**

- [ ] Test all endpoints
- [ ] Verify authentication flow
- [ ] Check email sending
- [ ] Test file uploads
- [ ] Monitor system resources
- [ ] Review error logs
- [ ] Test backup/restore
- [ ] Load test if possible

---

## 🚨 Common Issues & Solutions

### **Issue: High Memory Usage**
```bash
# Check memory
pm2 monit

# Fix: Limit memory
pm2 restart production-backend --max-memory-restart 1G
```

### **Issue: Database Connection Errors**
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Check connections
psql -U your_db_user -d your_production_db -c "SELECT count(*) FROM pg_stat_activity;"
```

### **Issue: Slow Performance**
```bash
# Check slow queries
tail -f logs/database/slow-queries.log

# Check API performance
curl http://localhost:3001/health/detailed
```

---

## 📞 Support

For deployment issues:
1. Check application logs: `pm2 logs`
2. Check system logs: `sudo journalctl -u production-backend`
3. Verify configuration: `pm2 show production-backend`
4. Test database: `psql -U your_db_user -d your_production_db`

---

**Happy deploying! 🚀**
