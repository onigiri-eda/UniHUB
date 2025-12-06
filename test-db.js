#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests PostgreSQL connection with current .env credentials
 */

require('dotenv').config();
const { Pool } = require('pg');

console.log('\n🔍 Database Connection Test\n');
console.log('Configuration:');
console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`  Port: ${process.env.DB_PORT || 5432}`);
console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
console.log(`  Database: ${process.env.DB_NAME || 'unihub'}`);
console.log(`  Password: ${process.env.DB_PASSWORD ? '●●●●' : 'NOT SET'}\n`);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'unihub'
});

console.log('Attempting connection...\n');

pool.query('SELECT NOW(), version()', (err, res) => {
  if (err) {
    console.error('❌ Connection Failed!\n');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('\nTroubleshooting:');
    console.error('1. Is PostgreSQL running?');
    console.error('2. Is the password correct? (current: ' + process.env.DB_PASSWORD + ')');
    console.error('3. Does database "' + (process.env.DB_NAME || 'unihub') + '" exist?');
    console.error('4. Is user "' + (process.env.DB_USER || 'postgres') + '" correct?\n');
  } else {
    console.log('✅ Connection Successful!\n');
    console.log('Server Time:', res.rows[0].now);
    console.log('PostgreSQL Version:', res.rows[0].version.split(',')[0]);
    console.log('\n✅ Database is ready to use!\n');
  }
  
  pool.end();
});
