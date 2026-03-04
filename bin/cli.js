#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ Error: Please provide a project name');
  console.log('Usage: npx exnj5 <project-name>');
  process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory "${projectName}" already exists`);
  process.exit(1);
}

console.log('🚀 Creating production-ready backend...\n');

console.log('📁 Creating project structure...');
fs.mkdirSync(targetDir, { recursive: true });

const sourceDir = path.join(__dirname, '..');

const copyRecursive = (src, dest) => {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    fs.readdirSync(src).forEach(item => {
      if (item === 'node_modules' || item === '.git' || item === 'bin') return;
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

copyRecursive(sourceDir, targetDir);

console.log('✅ Project structure created\n');

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  console.log('Please run "npm install" manually in the project directory\n');
}

console.log('🎉 Success! Your production-ready backend is ready!\n');
console.log('Next steps:');
console.log(`  1. cd ${projectName}`);
console.log('  2. cp .env.example .env');
console.log('  3. Edit .env with your database credentials');
console.log('  4. npm run migrate');
console.log('  5. npm run dev\n');
console.log('📚 Documentation: ./docs/\n');
console.log('Happy coding! 🚀');
