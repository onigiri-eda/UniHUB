# 🎓 UniHUB - PostgreSQL Integration Complete

## ✅ What's Been Set Up

Your UniHUB application now has **full PostgreSQL integration** with the following components:

### 1. **Backend API Server** (`server.js`)
- Express.js REST API
- Connects to your PostgreSQL database
- 10+ endpoints for university data
- Error handling and CORS support
- Response caching for performance

### 2. **Frontend API Client** (`js/api-service.js`)
- Clean API wrapper for JavaScript
- Automatic caching (5-minute TTL)
- Error handling and fallbacks
- Works with `fetch()` API

### 3. **Database Bridge** (`js/database-bridge.js`)
- ✅ Auto-connects to API if available
- ✅ Falls back to static data if offline
- ✅ App works with or without server running
- ✅ Seamless dual-mode operation

### 4. **ML Recommendation System** (already integrated)
- Now can use real database data
- Neural network with TensorFlow.js
- Shows confidence scores and comparisons
- Trained with domain knowledge

## 🚀 Quick Start

### Step 1: Create `.env` File
```bash
# Copy the example
cp .env.example .env

# Edit with your PostgreSQL credentials
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=unihub
# PORT=5000
```

**Or run the interactive setup:**
```bash
node setup.js
```

### Step 2: Ensure Database Tables Exist

Your PostgreSQL database needs these tables (which you already have):

```sql
-- Universities table
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

-- Academic Programs table
CREATE TABLE academic_programs (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Admissions table
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

-- International Cooperation table
CREATE TABLE international_cooperation (
    id SERIAL PRIMARY KEY,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    partner_countries TEXT,
    exchange_duration VARCHAR(100),
    opportunities TEXT
);
```

### Step 3: Start the Server
```bash
npm start
```

Expected output:
```
🚀 UniHUB API Server running on http://localhost:5000
📊 Database: unihub
Database connected successfully: ...
```

### Step 4: Test the API
```bash
# In a new terminal
curl http://localhost:5000/api/universities
curl http://localhost:5000/api/universities/1
curl http://localhost:5000/api/health
```

### Step 5: Open the Website
```
http://localhost/index.html
```

The app will automatically detect and use the API!

## 📊 API Endpoints

All endpoints return JSON. Base URL: `http://localhost:5000`

### Universities
```
GET /api/universities                    # Get all universities
GET /api/universities/:id                # Get specific university
GET /api/universities/by-city/:city      # Search by city
```

### Programs
```
GET /api/programs                        # Get all programs
GET /api/universities/:id/programs       # Programs for a university
GET /api/programs/:name/universities     # Universities with program
```

### Additional Info
```
GET /api/universities/:id/admissions     # Admission details
GET /api/universities/:id/international  # International cooperation
GET /api/health                          # Server health check
```

## 📁 New Files Created

```
UniHUB/
├── server.js                    # Express backend
├── setup.js                     # Configuration helper
├── .env                         # Your credentials (create it!)
├── .env.example                 # Configuration template
│
├── js/
│   ├── api-service.js          # API client
│   ├── database-bridge.js      # Fallback mechanism
│   └── (other files unchanged)
│
└── docs/
    ├── QUICKSTART.md           # Quick reference
    └── DATABASE_SETUP.md       # Detailed setup
```

## 🔄 How It Works

### With Backend Running
```
User → Browser → HTML/JS → API Service → Express Server → PostgreSQL
                                                  ↓
                                         Returns JSON data
```

### Without Backend (Offline Mode)
```
User → Browser → HTML/JS → Database Bridge → Static JS file
                                   ↓
                            universities.js (local data)
```

Both modes work transparently!

## 🧪 Testing

### Test API Connection
```javascript
// In browser console
testAPIConnection().then(status => {
  console.log('Connected:', status);
});
```

### Test Database Bridge
```javascript
// In browser console
const db = getDatabase();
console.log('Using API?', db.isConnected());

// Get university
db.getUniversityById('iitu').then(uni => {
  console.log(uni);
});
```

### Force Different Mode
```javascript
// Force API mode
db.forceAPI();

// Force static mode
db.forceStatic();
```

## 🛡️ Key Features

✅ **Fallback System** - App works offline with static data
✅ **Caching** - API responses cached for 5 minutes
✅ **Error Handling** - Graceful degradation
✅ **CORS Enabled** - Frontend can call backend
✅ **Connection Pooling** - Efficient database usage
✅ **Graceful Shutdown** - Clean server termination
✅ **Health Check** - Monitor server status
✅ **Environment Config** - Easy credential management

## 🔧 Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
psql -U postgres -h localhost -d unihub -c "SELECT 1"

# Check .env credentials
cat .env

# Check database tables exist
\dt  # in psql
```

### "Cannot GET /api/universities"
```bash
# Server isn't running. Start it:
npm start

# Check it's running:
curl http://localhost:5000/api/health
```

### "CORS error" in browser
```javascript
// This is expected if not using a local server
// App will still work with static data

// To test API, either:
// 1. Run npm start and visit http://localhost/index.html
// 2. Or use a local web server: python -m http.server 8000
```

### Port 5000 already in use
```bash
# Change PORT in .env
# Or find and stop the process:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

## 📖 Documentation Files

1. **QUICKSTART.md** - Quick reference guide
2. **DATABASE_SETUP.md** - Detailed setup instructions
3. **setup.js** - Interactive configuration tool

## 🚀 Next Steps

1. ✅ Create `.env` file with your credentials
2. ✅ Verify database tables exist
3. ✅ Run `npm start` to start the server
4. ✅ Open `index.html` in browser
5. ✅ Fill out the survey
6. ✅ See ML recommendations with real data!

## 📞 Need Help?

Check the documentation:
- For setup issues → **DATABASE_SETUP.md**
- For quick reference → **QUICKSTART.md**
- For API details → Comments in **server.js**

## 🎉 Success Indicators

When everything is working:
- ✅ `npm start` shows "Database connected successfully"
- ✅ `curl http://localhost:5000/api/health` returns OK
- ✅ Browser console shows no CORS errors
- ✅ Database bridge detects API automatically
- ✅ Survey shows real universities from database
- ✅ ML recommendations work with real data

---

**Happy coding! Your UniHUB PostgreSQL integration is ready.** 🎓
