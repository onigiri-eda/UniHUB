#!/usr/bin/env node

/**
 * UniHUB Verification & Test Script
 * Checks if everything is set up correctly
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('\n🔍 UniHUB Setup Verification Tool\n');
console.log('=' .repeat(50));

let allChecks = true;

// Check 1: .env file exists
console.log('\n✓ Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file found');
  
  // Load .env
  require('dotenv').config();
  
  const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length === 0) {
    console.log('   ✅ All required variables found');
  } else {
    console.log(`   ❌ Missing variables: ${missing.join(', ')}`);
    allChecks = false;
  }
} else {
  console.log('   ❌ .env file not found');
  console.log('   💡 Run: cp .env.example .env');
  allChecks = false;
}

// Check 2: Dependencies installed
console.log('\n✓ Checking npm dependencies...');
const packagePath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const required = ['express', 'pg', 'cors', 'dotenv'];
const installed = Object.keys(pkg.dependencies || {});

const missing = required.filter(dep => !installed.includes(dep));
if (missing.length === 0) {
  console.log('   ✅ All dependencies installed');
} else {
  console.log(`   ❌ Missing: ${missing.join(', ')}`);
  console.log('   💡 Run: npm install');
  allChecks = false;
}

// Check 3: Required files exist
console.log('\n✓ Checking required files...');
const files = [
  'server.js',
  'js/api-service.js',
  'js/database-bridge.js',
  'js/ml-recommendation.js',
  'index.html',
  'DATABASE_SETUP.md'
];

files.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allChecks = false;
  }
});

// Check 4: Database connection (if credentials available)
console.log('\n✓ Checking PostgreSQL connection...');
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
  });

  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log('   ❌ Cannot connect to PostgreSQL');
      console.log(`   Error: ${err.message}`);
      console.log('   💡 Ensure PostgreSQL is running and credentials are correct');
      allChecks = false;
    } else {
      console.log('   ✅ PostgreSQL connection successful');
      
      // Check tables
      console.log('\n✓ Checking database tables...');
      const tables = ['universities', 'academic_programs', 'admissions', 'international_cooperation'];
      
      const tablesQuery = `
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      pool.query(tablesQuery, (err, res) => {
        if (err) {
          console.log('   ❌ Error checking tables');
          allChecks = false;
        } else {
          const existingTables = res.rows.map(r => r.table_name);
          
          tables.forEach(table => {
            if (existingTables.includes(table)) {
              console.log(`   ✅ ${table}`);
            } else {
              console.log(`   ❌ ${table} not found`);
              allChecks = false;
            }
          });
          
          pool.end();
          printResult();
        }
      });
    }
  });
} else {
  console.log('   ⏭️  Skipping (no database credentials in .env)');
  printResult();
}

function printResult() {
  console.log('\n' + '='.repeat(50));
  
  if (allChecks) {
    console.log('\n✅ All checks passed! Ready to start the server:\n');
    console.log('   npm start\n');
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.\n');
    console.log('Quick fixes:\n');
    console.log('   1. cp .env.example .env');
    console.log('   2. Edit .env with your database credentials');
    console.log('   3. npm install');
    console.log('   4. Ensure PostgreSQL is running');
    console.log('   5. Run this script again\n');
  }
}
