# 🎓 UniHUB PostgreSQL Integration - Setup Checklist

## ✅ Installation Checklist

### Phase 1: Preparation
- [ ] Clone/open UniHUB project
- [ ] Node.js and npm installed (`node --version`)
- [ ] PostgreSQL running (`psql --version`)
- [ ] PostgreSQL database `unihub` created
- [ ] All tables created in database

### Phase 2: Installation
- [ ] Run `npm install` (installs express, pg, cors, dotenv)
- [ ] All 4 dependencies installed
- [ ] `verify.js` script exists
- [ ] Setup files created:
  - [ ] `server.js`
  - [ ] `js/api-service.js`
  - [ ] `js/database-bridge.js`
  - [ ] `.env.example`

### Phase 3: Configuration
- [ ] Copy `.env.example` → `.env`
- [ ] Edit `.env` with credentials:
  - [ ] DB_USER (default: postgres)
  - [ ] DB_PASSWORD (your password)
  - [ ] DB_HOST (default: localhost)
  - [ ] DB_PORT (default: 5432)
  - [ ] DB_NAME (default: unihub)
  - [ ] PORT (default: 5000)
- [ ] Verify credentials are correct
- [ ] Run verification: `node verify.js` (should pass all checks)

### Phase 4: Database Verification
- [ ] Connect to PostgreSQL: `psql -U postgres -d unihub`
- [ ] Tables exist:
  - [ ] `universities` table
  - [ ] `academic_programs` table
  - [ ] `admissions` table
  - [ ] `international_cooperation` table
- [ ] Data is populated in tables
- [ ] Connection works from terminal

### Phase 5: Server Startup
- [ ] Terminal is in `UniHUB` directory
- [ ] Run `npm start`
- [ ] Server shows:
  - [ ] "🚀 UniHUB API Server running on http://localhost:5000"
  - [ ] "📊 Database: unihub"
  - [ ] "Database connected successfully"
- [ ] No errors in console

### Phase 6: API Testing
- [ ] Open new terminal
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Test universities: `curl http://localhost:5000/api/universities`
- [ ] Both return valid JSON
- [ ] No connection errors

### Phase 7: Frontend Testing
- [ ] Open `index.html` in browser
- [ ] No console errors (F12 → Console)
- [ ] Browser console shows:
  - [ ] "✅ Connected to database API. Using live data."
  - [ ] OR "⚠️ API not available. Using static data."
- [ ] Survey form loads
- [ ] Survey form is interactive

### Phase 8: Feature Testing
- [ ] Complete survey questions
- [ ] Click "Show Results"
- [ ] Results display with:
  - [ ] Best match university
  - [ ] Confidence percentage
  - [ ] ML analysis section with all 4 universities
  - [ ] Color-coded score bars
- [ ] "More Info" button links to university page
- [ ] University page loads correct data

### Phase 9: Data Verification
- [ ] Click on university pages from survey
- [ ] IITU page shows correct data from database
- [ ] AITU page shows correct data
- [ ] KBTU page shows correct data
- [ ] UIB page shows correct data
- [ ] Admission documents display
- [ ] International cooperation shows

### Phase 10: Production Readiness
- [ ] Database backup created
- [ ] `.env` file is in `.gitignore` (never commit credentials!)
- [ ] All npm packages up to date
- [ ] No console warnings or errors
- [ ] Response times are reasonable (<500ms)

## 🐛 Troubleshooting Checklist

### If Server Won't Start
- [ ] Is PostgreSQL running?
- [ ] Does database `unihub` exist?
- [ ] Are `.env` credentials correct?
- [ ] Is port 5000 available?
- [ ] Did `npm install` complete successfully?

### If Database Connection Fails
- [ ] Verify PostgreSQL is listening on correct port
- [ ] Check firewall isn't blocking connection
- [ ] Verify credentials in `.env`:
  ```bash
  psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT 1"
  ```

### If API Endpoints Return Errors
- [ ] Verify database tables exist: `\dt` in psql
- [ ] Check table names match exactly (case-sensitive)
- [ ] Verify data is populated in tables
- [ ] Check server console for SQL error messages

### If Frontend Won't Load
- [ ] Check browser console for errors (F12)
- [ ] Verify `index.html` path is correct
- [ ] Check all required JS files loaded:
  - [ ] api-service.js
  - [ ] database-bridge.js
  - [ ] ml-recommendation.js
  - [ ] universities.js
  - [ ] main.js

### If Survey Results Don't Show
- [ ] Check browser console for JavaScript errors
- [ ] Verify all form fields are filled
- [ ] Check ML recommendation engine initialized
- [ ] Verify database bridge detected API

## 📊 Performance Checklist

- [ ] API responses under 500ms
- [ ] Survey loads in under 2 seconds
- [ ] Results display within 1 second
- [ ] No memory leaks in browser console
- [ ] ML model trains successfully
- [ ] Caching is working (repeated requests faster)

## 🔒 Security Checklist

- [ ] `.env` file NOT in git repository
- [ ] `.gitignore` includes `.env`
- [ ] Database password is strong
- [ ] No console.logs revealing sensitive data
- [ ] CORS configured for your domain only (in production)
- [ ] SQL injection protection (using parameterized queries ✓)
- [ ] Error messages don't reveal database structure

## 📚 Documentation Checklist

- [ ] QUICKSTART.md reviewed
- [ ] DATABASE_SETUP.md reviewed
- [ ] INTEGRATION_SUMMARY.md reviewed
- [ ] API endpoints documented
- [ ] Setup process documented
- [ ] Troubleshooting guide available

## 🚀 Launch Checklist

Before going live:
- [ ] All tests passed
- [ ] Database backed up
- [ ] `.env` configured for production
- [ ] Server can handle expected traffic
- [ ] Error handling works properly
- [ ] Analytics/logging configured
- [ ] Monitoring set up
- [ ] Documentation updated

## 📋 Final Verification

Run this to confirm everything works:

```bash
# 1. Verify installation
node verify.js

# 2. Start server
npm start

# 3. In another terminal, test API
curl http://localhost:5000/api/health

# 4. Open browser
# http://localhost/index.html

# 5. Check browser console (F12)
# Should see "Connected to database API" message
```

## ✨ Success Criteria

Everything is working when:
- ✅ `npm start` runs without errors
- ✅ API endpoints respond with valid data
- ✅ Browser shows no console errors
- ✅ Survey displays correctly
- ✅ ML recommendations work
- ✅ University pages show correct data
- ✅ All 4 universities are accessible

## 🎉 You're Ready!

Once all checkboxes are checked, your UniHUB PostgreSQL integration is complete and ready to use!

---

**Need help?** Check the documentation files:
- QUICKSTART.md
- DATABASE_SETUP.md
- INTEGRATION_SUMMARY.md

Happy coding! 🚀
