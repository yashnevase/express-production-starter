# Installation & Distribution Guide

Complete guide for installing, sharing, and distributing the Express Production Starter library.

---

## Table of Contents
1. [For Users: How to Install](#for-users-how-to-install)
2. [For Developers: How to Share](#for-developers-how-to-share)
3. [Publishing to npm](#publishing-to-npm)
4. [Distribution via GitHub](#distribution-via-github)
5. [Distribution via Zip File](#distribution-via-zip-file)
6. [First-Time Setup](#first-time-setup)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 For Users: How to Install

### **Method 1: NPM (Recommended - After Publishing)**

Once published to npm, users can install with:

```bash
# Create new project
npx @production-backend/express-starter my-backend
cd my-backend

# Or install globally
npm install -g @production-backend/express-starter
create-production-backend my-backend
cd my-backend
```

### **Method 2: Clone from GitHub**

```bash
# Clone the repository
git clone https://github.com/your-username/express-production-starter.git my-backend
cd my-backend

# Remove git history (start fresh)
rm -rf .git
git init

# Install dependencies
npm install
```

### **Method 3: Download Zip File**

1. Download the zip file from GitHub or your distribution source
2. Extract to your desired location
3. Rename the folder to your project name
4. Open terminal in the folder
5. Run `npm install`

### **Method 4: Copy Folder Directly**

```bash
# Copy the entire folder
cp -r /path/to/express-production-starter /path/to/my-backend
cd /path/to/my-backend

# Install dependencies
npm install
```

---

## 👨‍💻 For Developers: How to Share

### **Option 1: Publish to npm (Recommended)**

See [Publishing to npm](#publishing-to-npm) section below.

### **Option 2: Share via GitHub**

1. **Create GitHub Repository**
   ```bash
   cd express-production-starter
   git init
   git add .
   git commit -m "Initial commit: Production-ready Express.js backend"
   git branch -M main
   git remote add origin https://github.com/your-username/express-production-starter.git
   git push -u origin main
   ```

2. **Share the Repository URL**
   - Users can clone: `git clone https://github.com/your-username/express-production-starter.git`
   - Or download as zip from GitHub

3. **Add Release Tags**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

### **Option 3: Share as Zip File**

1. **Create Zip Archive**
   ```bash
   # From parent directory
   cd /Users/yashnevse/Desktop/RENT
   
   # Create zip (exclude node_modules, logs, uploads)
   zip -r express-production-starter-v1.0.0.zip express-production-starter \
     -x "*/node_modules/*" \
     -x "*/logs/*" \
     -x "*/uploads/*" \
     -x "*/.git/*" \
     -x "*/package-lock.json"
   ```

2. **Share via**:
   - Email attachment
   - Cloud storage (Google Drive, Dropbox)
   - File sharing services (WeTransfer, SendAnywhere)
   - Your own website/server

### **Option 4: Private npm Registry**

For organizations:
- Use **Verdaccio** (private npm registry)
- Use **GitHub Packages**
- Use **npm Enterprise**

---

## 📤 Publishing to npm

### **Prerequisites**
1. npm account (create at https://www.npmjs.com/signup)
2. Verified email address
3. Unique package name

### **Step 1: Prepare Package**

1. **Update package.json**
   ```json
   {
     "name": "@your-username/express-production-starter",
     "version": "1.0.0",
     "description": "Production-ready Express.js backend with RBAC, security, and scalability",
     "author": "Your Name <your.email@example.com>",
     "license": "MIT",
     "repository": {
       "type": "git",
       "url": "https://github.com/your-username/express-production-starter"
     },
     "keywords": [
       "express",
       "backend",
       "production",
       "boilerplate",
       "starter",
       "rbac",
       "jwt",
       "security",
       "postgresql",
       "sequelize"
     ]
   }
   ```

2. **Check package name availability**
   ```bash
   npm search @your-username/express-production-starter
   ```

3. **Add .npmignore** (optional, uses .gitignore by default)
   ```
   # .npmignore
   tests/
   docs/
   .env.example
   .eslintrc.js
   nodemon.json
   ```

### **Step 2: Login to npm**

```bash
npm login
# Enter username, password, email
```

### **Step 3: Publish**

```bash
# Dry run (test without publishing)
npm publish --dry-run

# Publish (scoped package - public)
npm publish --access public

# Or publish (unscoped package)
npm publish
```

### **Step 4: Verify Publication**

```bash
# Check on npm
npm view @your-username/express-production-starter

# Or visit
# https://www.npmjs.com/package/@your-username/express-production-starter
```

### **Step 5: Update Versions**

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Publish new version
npm publish --access public
```

---

## 🐙 Distribution via GitHub

### **Step 1: Create Repository**

1. Go to https://github.com/new
2. Repository name: `express-production-starter`
3. Description: "Production-ready Express.js backend boilerplate"
4. Choose: Public or Private
5. Don't initialize with README (we have one)
6. Click "Create repository"

### **Step 2: Push Code**

```bash
cd /Users/yashnevse/Desktop/RENT/express-production-starter

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready Express.js backend boilerplate

Features:
- JWT Authentication & RBAC
- Multi-layer security (OWASP Top 10)
- Cluster mode & caching
- PDF, Excel, Email generation
- System monitoring & logging
- Swagger documentation
- 40+ built-in features"

# Add remote
git remote add origin https://github.com/your-username/express-production-starter.git

# Push
git branch -M main
git push -u origin main
```

### **Step 3: Create Release**

1. Go to repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```markdown
   ## 🚀 Express Production Starter v1.0.0
   
   Production-ready Express.js backend boilerplate with enterprise-grade security and scalability.
   
   ### ✨ Features
   - JWT Authentication & RBAC
   - OWASP Top 10 Security
   - Cluster Mode & Caching
   - PDF, Excel, Email Generation
   - System Monitoring & Logging
   - Swagger Documentation
   - 40+ Built-in Features
   
   ### 📦 Installation
   ```bash
   git clone https://github.com/your-username/express-production-starter.git
   cd express-production-starter
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run migrate
   npm run dev
   ```
   
   ### 📚 Documentation
   - [README.md](README.md)
   - [FEATURES.md](FEATURES.md)
   - [Quick Start](docs/QUICK_START.md)
   - [API Documentation](docs/API.md)
   ```
6. Attach zip file (optional)
7. Click "Publish release"

### **Step 4: Add Topics**

On GitHub repository page:
- Click "⚙️" next to "About"
- Add topics: `express`, `nodejs`, `backend`, `boilerplate`, `jwt`, `rbac`, `security`, `postgresql`, `production-ready`

### **Step 5: Update README Badges**

Add to top of README.md:
```markdown
[![GitHub release](https://img.shields.io/github/release/your-username/express-production-starter.svg)](https://github.com/your-username/express-production-starter/releases)
[![GitHub stars](https://img.shields.io/github/stars/your-username/express-production-starter.svg)](https://github.com/your-username/express-production-starter/stargazers)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
```

---

## 📁 Distribution via Zip File

### **Create Distribution Zip**

```bash
cd /Users/yashnevse/Desktop/RENT

# Create clean zip (exclude unnecessary files)
zip -r production-backend-boilerplate-v1.0.0.zip express-production-starter \
  -x "*/node_modules/*" \
  -x "*/logs/*" \
  -x "*/uploads/*" \
  -x "*/.git/*" \
  -x "*/package-lock.json" \
  -x "*/.DS_Store" \
  -x "*/npm-debug.log"

# Verify zip contents
unzip -l production-backend-boilerplate-v1.0.0.zip | head -20
```

### **Share Zip File**

**Option 1: Cloud Storage**
- Upload to Google Drive, Dropbox, OneDrive
- Share link with recipients

**Option 2: File Sharing Services**
- WeTransfer (up to 2GB free)
- SendAnywhere
- Firefox Send alternatives

**Option 3: Your Own Server**
- Upload to your website
- Share download link

**Option 4: Email** (if small enough)
- Attach to email
- Send to recipients

### **User Instructions for Zip**

Include this in your sharing message:

```
📦 Express Production Starter v1.0.0

Installation:
1. Extract the zip file
2. Open terminal in the extracted folder
3. Run: npm install
4. Copy .env.example to .env
5. Edit .env with your database credentials
6. Run: npm run migrate
7. Run: npm run dev

Documentation: See README.md

Support: your.email@example.com
```

---

## 🔧 First-Time Setup

After installation (any method), users should:

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` file:
```bash
# Required
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=generate-a-strong-random-secret-minimum-32-characters

# Optional (for features)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
REDIS_HOST=localhost  # If using Bull queues
```

### **3. Create Database**
```bash
# PostgreSQL
createdb your_database_name

# Or using psql
psql -U postgres
CREATE DATABASE your_database_name;
\q
```

### **4. Run Migrations**
```bash
npm run migrate
```

### **5. Start Development Server**
```bash
npm run dev
```

### **6. Verify Installation**
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test Swagger docs
open http://localhost:3001/api-docs
```

---

## 🐛 Troubleshooting

### **Issue: npm install fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### **Issue: Database connection fails**

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check database exists: `psql -l`
3. Verify credentials in `.env`
4. Check PostgreSQL is accepting connections

### **Issue: Port already in use**

**Solution:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Or change PORT in .env
PORT=3002
```

### **Issue: Migration fails**

**Solution:**
```bash
# Check database connection
npm run migrate:status

# Rollback last migration
npm run migrate:undo

# Run migrations again
npm run migrate
```

### **Issue: Sharp installation fails (image processing)**

**Solution:**
```bash
# Rebuild Sharp
npm rebuild sharp

# Or install with specific platform
npm install --platform=darwin --arch=x64 sharp
```

### **Issue: Puppeteer installation fails (PDF generation)**

**Solution:**
```bash
# Skip Chromium download during install
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Then download Chromium manually
node node_modules/puppeteer/install.js
```

### **Issue: Permission denied errors**

**Solution:**
```bash
# Fix permissions
sudo chown -R $(whoami) .

# Or run with sudo (not recommended)
sudo npm install
```

---

## 📞 Support & Community

### **Getting Help**
- 📚 Read [FEATURES.md](FEATURES.md) for detailed feature documentation
- 📖 Check [docs/](docs/) folder for guides
- 🐛 Report issues on GitHub Issues
- 💬 Ask questions in GitHub Discussions

### **Contributing**
- Fork the repository
- Create feature branch
- Submit pull request
- Follow code style guidelines

### **Stay Updated**
- ⭐ Star the repository on GitHub
- 👀 Watch for releases
- 📧 Subscribe to release notifications

---

## 🎉 Success!

Your Express Production Starter is now ready to use!

**Next Steps:**
1. Read [FEATURES.md](FEATURES.md) to understand all capabilities
2. Check [docs/QUICK_START.md](docs/QUICK_START.md) for quick start guide
3. Review [docs/API.md](docs/API.md) for API documentation
4. Explore [docs/EXAMPLES.md](docs/EXAMPLES.md) for code examples
5. Start building your business logic!

**Happy Coding! 🚀**
