import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  fs.copyFileSync('.env.example', '.env');
  console.log('Created .env file from .env.example');
}

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('\nSetup complete! Please update your .env file with your MongoDB credentials and JWT secret.');