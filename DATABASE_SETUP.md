# UniHUB - PostgreSQL Integration Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Install Dependencies

```bash
cd UniHUB
npm install
```

This will install:
- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables management

## Step 2: Configure Database Connection

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your PostgreSQL credentials:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unihub
PORT=5000
```

## Step 3: Verify Database Schema

Make sure your PostgreSQL database has these tables with the correct structure:

### universities
```sql
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    mission TEXT,
    history TEXT,
    achievements TEXT,
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100)
);
```

### academic_programs
```sql
CREATE TABLE academic_programs (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);
```

### admissions
```sql
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    required_documents TEXT,
    deadline DATE,
    process TEXT,
    tuition_bachelor NUMERIC(10, 2),
    tuition_master NUMERIC(10, 2),
    scholarships TEXT
);
```

### international_cooperation
```sql
CREATE TABLE international_cooperation (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    partner_countries TEXT,
    exchange_duration VARCHAR(100),
    opportunities TEXT
);
```

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 UniHUB API Server running on http://localhost:5000
📊 Database: unihub
Database connected successfully: 2025-12-06...
```

## Step 5: Test the API

In a new terminal, test the endpoints:

```bash
# Get all universities
curl http://localhost:5000/api/universities

# Get specific university with all data
curl http://localhost:5000/api/universities/1

# Get universities by city
curl http://localhost:5000/api/universities/by-city/Almaty

# Health check
curl http://localhost:5000/api/health
```

## Step 6: Update Frontend to Use API

The frontend is already configured to use the API through `js/api-service.js`.

### Using the API in your JavaScript code:

```javascript
// Initialize API Service
const api = initializeAPIService('http://localhost:5000');

// Get all universities
const universities = await api.getAllUniversities();

// Get specific university
const iitu = await api.getUniversityById(1);

// Get universities by city
const almaty = await api.getUniversitiesByCity('Almaty');

// Get programs for a university
const programs = await api.getProgramsByUniversity(1);
```

## API Endpoints Reference

### Universities
- `GET /api/universities` - Get all universities
- `GET /api/universities/:id` - Get specific university with all data
- `GET /api/universities/by-city/:city` - Search by city

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/universities/:id/programs` - Get programs for a university
- `GET /api/programs/:programName/universities` - Find universities with specific program

### Additional Info
- `GET /api/universities/:id/admissions` - Get admission details
- `GET /api/universities/:id/international` - Get international cooperation info
- `GET /api/health` - Health check

## Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running
- Verify `.env` credentials are correct
- Ensure database name exists

### "CORS error"
- CORS is already enabled in the server
- Check frontend is making requests to `http://localhost:5000`

### "Port 5000 already in use"
- Change `PORT` in `.env` or stop the process using that port

## Production Deployment

For production, update `.env`:
```
DB_HOST=production-server
DB_PASSWORD=secure_password
PORT=3000
NODE_ENV=production
```

Then deploy using a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "unihub-api"
pm2 save
```

## Next Steps

1. The ML recommendation system in `js/ml-recommendation.js` can now fetch real university data
2. Update university pages to dynamically load data from the API
3. Create admin panel for managing universities and programs
4. Add user accounts and track survey submissions
