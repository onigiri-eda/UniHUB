const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'unihub'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Test database connection (non-blocking)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

console.log('✅ Server starting, about to listen on port:', PORT);

// ============================================
// API ENDPOINTS
// ============================================

// Get all universities with complete data
app.get('/api/universities', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, city FROM universities ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching universities:', err);
    res.status(500).json({ error: 'Error fetching universities' });
  }
});

// Get single university with all related data
app.get('/api/universities/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const uniQuery = 'SELECT * FROM universities WHERE id = $1';
    const programsQuery = 'SELECT * FROM academic_programs WHERE university_id = $1';
    const admissionQuery = 'SELECT * FROM admissions WHERE university_id = $1';
    const intlQuery = 'SELECT * FROM international_cooperation WHERE university_id = $1';

    const uniResult = await pool.query(uniQuery, [id]);
    const programsResult = await pool.query(programsQuery, [id]);
    const admissionResult = await pool.query(admissionQuery, [id]);
    const intlResult = await pool.query(intlQuery, [id]);

    if (uniResult.rows.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    const university = uniResult.rows[0];
    
    // Organize programs by level
    const programs = {
      bachelor: programsResult.rows
        .filter(p => p.level.toLowerCase() === 'bachelor')
        .map(p => p.name),
      master: programsResult.rows
        .filter(p => p.level.toLowerCase() === 'master')
        .map(p => p.name)
    };

    const admission = admissionResult.rows[0] || {};
    const international = intlResult.rows[0] || {};

    // Parse JSON fields if they exist
    try {
      if (admission.required_documents && typeof admission.required_documents === 'string') {
        admission.documents = JSON.parse(admission.required_documents);
      } else {
        admission.documents = [];
      }

      if (international.partner_countries && typeof international.partner_countries === 'string') {
        international.exchanges = JSON.parse(international.partner_countries);
      } else {
        international.exchanges = [];
      }
    } catch (e) {
      console.error('Error parsing JSON fields:', e);
    }

    res.json({
      ...university,
      programs,
      admission: {
        documents: admission.documents || [],
        deadline: admission.deadline,
        process: admission.process,
        tuition: {
          bachelor: admission.tuition_bachelor,
          master: admission.tuition_master
        },
        scholarships: admission.scholarships
      },
      international: {
        exchanges: international.exchanges || [],
        duration: international.exchange_duration,
        opportunities: international.opportunities
      }
    });
  } catch (err) {
    console.error('Error fetching university details:', err);
    res.status(500).json({ error: 'Error fetching university details' });
  }
});

// Get all academic programs
app.get('/api/programs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM academic_programs');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ error: 'Error fetching programs' });
  }
});

// Get programs by university
app.get('/api/universities/:id/programs', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM academic_programs WHERE university_id = $1 ORDER BY level',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ error: 'Error fetching programs' });
  }
});

// Get admission info by university
app.get('/api/universities/:id/admissions', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM admissions WHERE university_id = $1',
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching admission info:', err);
    res.status(500).json({ error: 'Error fetching admission info' });
  }
});

// Get international cooperation info
app.get('/api/universities/:id/international', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM international_cooperation WHERE university_id = $1',
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching international cooperation info:', err);
    res.status(500).json({ error: 'Error fetching international cooperation info' });
  }
});

// Search universities by city
app.get('/api/universities/by-city/:city', async (req, res) => {
  const { city } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM universities WHERE LOWER(city) = LOWER($1)',
      [city]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching universities:', err);
    res.status(500).json({ error: 'Error searching universities' });
  }
});

// Get universities with specific program
app.get('/api/programs/:programName/universities', async (req, res) => {
  const { programName } = req.params;
  try {
    const result = await pool.query(
      `SELECT DISTINCT u.* FROM universities u
       INNER JOIN academic_programs ap ON u.id = ap.university_id
       WHERE LOWER(ap.name) LIKE LOWER($1)`,
      [`%${programName}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching programs:', err);
    res.status(500).json({ error: 'Error searching programs' });
  }
});

// Cache for database data to avoid repeated queries
let cachedDatabaseData = null;
let cacheTTL = 5 * 60 * 1000; // 5 minutes
let cacheTimestamp = 0;

// Get all data for AI chat context (with caching)
app.get('/api/all-data', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cachedDatabaseData && (now - cacheTimestamp) < cacheTTL) {
      console.log('✓ Returning cached database data');
      return res.json(cachedDatabaseData);
    }
    
    console.log('Loading database data (no cache)...');
    
    // Get only essential data, limit rows - handle NULL values
    const universities = await pool.query(
      `SELECT id, name, COALESCE(city, 'Unknown') as city FROM universities LIMIT 10`
    );
    
    const programs = await pool.query(
      `SELECT university_id, COALESCE(name, 'Unknown') as name, COALESCE(level, 'Unknown') as level 
       FROM academic_programs LIMIT 50`
    );
    
    const admission = await pool.query(
      `SELECT university_id, COALESCE(required_documents, 'N/A') as required_documents, 
              COALESCE(tuition_bachelor, 0) as tuition_bachelor, 
              COALESCE(tuition_master, 0) as tuition_master 
       FROM admissions LIMIT 30`
    );
    
    const cooperation = await pool.query(
      `SELECT university_id, COALESCE(partner_countries, 'N/A') as partner_countries 
       FROM international_cooperation LIMIT 40`
    );
    
    const data = {
      universities: universities.rows,
      programs: programs.rows,
      admission: admission.rows,
      cooperation: cooperation.rows
    };
    
    // Cache the data
    cachedDatabaseData = data;
    cacheTimestamp = now;
    
    console.log(`✓ Database data loaded: ${universities.rows.length} unis, ${programs.rows.length} programs`);
    res.json(data);
  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ error: 'Error fetching data: ' + err.message });
  }
});

// Map abbreviations to university IDs (IITU=1, AITU=2, KBTU=3, UIB=4)
const universityMap = {
  'IITU': 1,
  'AITU': 2,
  'KBTU': 3,
  'UIB': 4
};

// Simple function to get university by abbreviation or ID
async function getUniversityData(identifier) {
  let uniId = universityMap[identifier.toUpperCase()];
  
  if (!uniId) {
    uniId = parseInt(identifier);
  }
  
  if (!uniId || uniId < 1 || uniId > 4) {
    return null;
  }
  
  try {
    const uniQuery = await pool.query('SELECT id, name, city FROM universities WHERE id = $1', [uniId]);
    if (uniQuery.rows.length === 0) return null;
    
    const programsQuery = await pool.query('SELECT name FROM academic_programs WHERE university_id = $1 LIMIT 10', [uniId]);
    const admissionQuery = await pool.query('SELECT tuition_bachelor, tuition_master, scholarships FROM admissions WHERE university_id = $1', [uniId]);
    const coopQuery = await pool.query('SELECT partner_countries FROM international_cooperation WHERE university_id = $1', [uniId]);
    
    return {
      id: uniQuery.rows[0].id,
      name: uniQuery.rows[0].name,
      city: uniQuery.rows[0].city,
      programs: programsQuery.rows.map(p => p.name),
      tuition_bachelor: admissionQuery.rows.length > 0 ? admissionQuery.rows[0].tuition_bachelor : 0,
      tuition_master: admissionQuery.rows.length > 0 ? admissionQuery.rows[0].tuition_master : 0,
      scholarships: admissionQuery.rows.length > 0 ? admissionQuery.rows[0].scholarships : 'N/A',
      partners: coopQuery.rows.length > 0 ? coopQuery.rows[0].partner_countries : 'N/A'
    };
  } catch (err) {
    console.error('Error fetching university data:', err);
    return null;
  }
}

// Compare two universities
app.get('/api/compare-universities', async (req, res) => {
  const { uni1, uni2 } = req.query;
  
  if (!uni1 || !uni2) {
    return res.status(400).json({ error: 'Please provide uni1 and uni2 parameters' });
  }
  
  try {
    console.log(`Comparing ${uni1} vs ${uni2}...`);
    
    const university1 = await getUniversityData(uni1);
    const university2 = await getUniversityData(uni2);
    
    if (!university1 || !university2) {
      console.log('University not found:', { uni1Found: !!university1, uni2Found: !!university2 });
      return res.status(404).json({ error: 'University not found' });
    }
    
    const result = {
      university1,
      university2
    };
    
    console.log(`✓ Comparison ready: ${uni1} vs ${uni2}`);
    res.json(result);
  } catch (err) {
    console.error('Error comparing universities:', err);
    res.status(500).json({ error: 'Error comparing universities: ' + err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
  console.log(`🚀 UniHUB API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'unihub'}`);
  console.log('✅ Server is fully initialized and listening');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep server running - don't shutdown on signals from terminal
process.on('SIGINT', () => {
  console.log('Keep-alive: ignoring SIGINT');
});