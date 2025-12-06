# UniHUB PostgreSQL Integration - Quick Start

## What's Been Set Up

Your UniHUB application now has:

✅ **Express.js Backend API** (`server.js`)
- Connects to your PostgreSQL database
- Provides RESTful endpoints for all university data
- Caching for better performance
- Error handling and graceful shutdown

✅ **Frontend API Service** (`js/api-service.js`)
- Client-side API wrapper with caching
- Automatic fallback to static data if server is down
- Clean, easy-to-use methods for all API calls

✅ **Database Bridge** (`js/database-bridge.js`)
- Automatic detection of API availability
- Seamless fallback to static `universities.js` data
- Works offline with local data

✅ **Machine Learning Recommendation Engine** (`js/ml-recommendation.js`)
- Can now use real university data from the database
- Neural network trained with domain knowledge
- Shows confidence scores and comparisons

## Installation & Setup

### 1. Install NPM Dependencies
```bash
cd UniHUB
npm install
```

This adds:
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Configure Database Credentials

Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unihub
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

```bash
npm start
```

Expected output:
```
🚀 UniHUB API Server running on http://localhost:5000
📊 Database: unihub
Database connected successfully: ...
```

## Usage

### Option A: With Backend Running (Recommended)

1. Start server: `npm start`
2. Open `index.html` in browser
3. App automatically connects to the API
4. All data is fetched from PostgreSQL database

### Option B: Without Backend (Works Offline)

1. Open `index.html` directly in browser
2. App uses static `universities.js` data
3. All features work except it won't reflect database changes

## API Endpoints

Once the server is running, test endpoints:

```bash
# Get all universities
curl http://localhost:5000/api/universities

# Get university by ID (1-4)
curl http://localhost:5000/api/universities/1

# Get by city
curl http://localhost:5000/api/universities/by-city/Almaty

# Search programs
curl http://localhost:5000/api/programs/Software%20Engineering/universities

# Health check
curl http://localhost:5000/api/health
```

## File Structure

```
UniHUB/
├── server.js                          # Express backend (connects to PostgreSQL)
├── .env                               # Database credentials (create from .env.example)
├── package.json                       # npm dependencies
│
├── js/
│   ├── api-service.js                # API client service
│   ├── database-bridge.js            # Fallback mechanism
│   ├── ml-recommendation.js          # ML recommendation engine
│   ├── universities.js               # Static fallback data
│   └── main.js                       # Main app logic
│
├── index.html                        # Home page
├── iitu.html, aitu.html, kbtu.html, uib.html  # University pages
├── css/styles.css                    # Styles
└── DATABASE_SETUP.md                 # Detailed setup guide
```

## Database Schema

Your PostgreSQL database should have these 4 tables:

1. **universities** - University metadata
2. **academic_programs** - Bachelor and Master programs
3. **admissions** - Admission requirements, deadlines, tuition
4. **international_cooperation** - Partner countries and opportunities

## Key Features

### 🔄 Dual Mode
- Works **with** backend (live database)
- Works **without** backend (static fallback)

### 🧠 Machine Learning
- Neural network recommends best university
- Shows confidence scores
- Compares all 4 options

### ⚡ Performance
- API response caching (5 minutes)
- Lightweight JSON responses
- CORS enabled for frontend

### 🛡️ Reliability
- Graceful fallback if server unavailable
- Error handling on all endpoints
- Database connection pooling

## Troubleshooting

**Q: "Database connection failed" error**
```
A: Check:
   - PostgreSQL is running
   - .env credentials are correct
   - Database exists and tables are created
```

**Q: "API not responding" in browser console**
```
A: This is normal if server isn't running.
   App will use static data instead.
   Start the server with: npm start
```

**Q: CORS error**
```
A: CORS is enabled. Make sure frontend is at:
   http://localhost:PORT (not from file://)
```

**Q: Port 5000 already in use**
```
A: Change PORT in .env or find and kill the process:
   On Windows: netstat -ano | findstr :5000
```

## Next Steps

1. **Start the server**: `npm start`
2. **Open the site**: Visit `http://localhost/index.html`
3. **Test the API**: Check API endpoints
4. **Try the survey**: Answer questions, see ML recommendations
5. **Deploy**: Follow DATABASE_SETUP.md for production

## Support

For detailed setup, see: **DATABASE_SETUP.md**

For API documentation, check server.js comments or run:
```bash
curl http://localhost:5000/api/health
```
