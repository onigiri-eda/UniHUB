# UniHUB - University Selection Platform with PostgreSQL Integration

> 🎓 Intelligent university recommendation system using Machine Learning + PostgreSQL

## 🌟 Features

✨ **Machine Learning Recommendations**
- Neural network-based university matching
- 5-question survey with AI analysis
- Confidence scores and comparative analysis
- TensorFlow.js powered

🗄️ **PostgreSQL Database Integration**
- RESTful API backend (Express.js)
- Real-time data from database
- Fallback to static data when offline
- Automatic connection management

🎯 **Smart Matching**
- Analyzes specialization, city, budget, priorities
- Deep learning model with domain knowledge training
- Visual comparison of all 4 universities
- Personalized recommendations

📱 **Responsive Design**
- Mobile-first approach
- Works on all devices
- Smooth animations and interactions
- Accessible UI

🏢 **University Information**
- IITU - International IT University
- AITU - Astana IT University
- KBTU - Kazakh-British Technical University
- UIB - University of International Business

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm or yarn

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Database
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Start Server
```bash
npm start
```

### 4. Open Website
```
http://localhost/index.html
```

## 📋 Setup Steps

### Step 1: Environment Configuration
Create `.env`:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unihub
PORT=5000
```

Or run interactive setup:
```bash
node setup.js
```

### Step 2: Verify Installation
```bash
node verify.js
```

### Step 3: Start Server
```bash
npm start
```

Server runs on: `http://localhost:5000`

## 🔌 API Endpoints

### Universities
```
GET /api/universities              # All universities
GET /api/universities/:id          # Specific university
GET /api/universities/by-city/:city  # Search by city
```

### Academic Programs
```
GET /api/programs                  # All programs
GET /api/universities/:id/programs # Programs for university
GET /api/programs/:name/universities  # Universities with program
```

### Additional Info
```
GET /api/universities/:id/admissions       # Admission requirements
GET /api/universities/:id/international    # International cooperation
GET /api/health                            # Server status
```

## 📂 Project Structure

```
UniHUB/
├── server.js                 # Express backend API
├── setup.js                  # Configuration helper
├── verify.js                 # Setup verification tool
├── .env                      # Database credentials (create it!)
├── package.json              # Dependencies
│
├── js/
│   ├── api-service.js        # API client
│   ├── database-bridge.js    # Fallback mechanism
│   ├── ml-recommendation.js  # ML recommendation engine
│   ├── universities.js       # Static fallback data
│   ├── main.js               # Main application logic
│   ├── chat.js               # Chat interface
│   └── panorama-switcher.js  # 360° panorama viewer
│
├── css/
│   └── styles.css            # Application styles
│
├── html files
│   ├── index.html            # Home page with survey
│   ├── iitu.html             # IITU details page
│   ├── aitu.html             # AITU details page
│   ├── kbtu.html             # KBTU details page
│   └── uib.html              # UIB details page
│
└── docs/
    ├── DATABASE_SETUP.md     # Detailed database setup
    ├── QUICKSTART.md         # Quick reference
    └── INTEGRATION_SUMMARY.md # Integration overview
```

## 🧠 How ML Recommendations Work

1. **User Survey** (5 questions)
   - What specialization?
   - Which city?
   - Need international programs?
   - What's your budget?
   - What's your priority?

2. **Feature Encoding**
   - Specialization: IT, Engineering, Business, Other
   - City: Almaty, Astana, Other
   - Budget: Low, Medium, High
   - Priority: Quality, Reputation, Innovation, Career

3. **Neural Network**
   - 3 hidden layers with dropout regularization
   - 32 → 16 → 8 neurons
   - Trained on domain knowledge scenarios

4. **Results**
   - Best match university
   - Confidence percentage
   - Comparison scores for all 4 universities

## 🔄 Dual-Mode Operation

### With Backend (Recommended)
```
Survey → ML Engine → API → PostgreSQL → Real Data
```
- Uses live database
- Always current information
- Real-time updates

### Without Backend (Offline)
```
Survey → ML Engine → Static JS → Fallback Data
```
- Uses `universities.js` data
- Works without internet
- App continues functioning

Both modes work transparently!

## 🛠️ Troubleshooting

### PostgreSQL Connection Issues
```bash
# Test connection
psql -U postgres -h localhost -d unihub

# Check credentials in .env
cat .env

# Verify tables exist
\dt
```

### Port Already in Use
```bash
# Change PORT in .env
# Or kill process using port:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### CORS Errors
CORS is already enabled. Make sure to:
- Run `npm start` to start backend
- Access via `http://localhost` not `file://`

### API Not Responding
Check if server is running:
```bash
curl http://localhost:5000/api/health
```

## 📊 Database Schema

### universities
- id (PK)
- name
- city
- mission
- history
- achievements
- address
- phone
- email

### academic_programs
- id (PK)
- university_id (FK)
- level (bachelor/master)
- name
- description

### admissions
- id (PK)
- university_id (FK)
- required_documents
- deadline
- process
- tuition_bachelor
- tuition_master
- scholarships

### international_cooperation
- id (PK)
- university_id (FK)
- partner_countries
- exchange_duration
- opportunities

## 🚀 Deployment

### Local Development
```bash
npm install
node setup.js
npm start
```

### Production
Update `.env`:
```
NODE_ENV=production
DB_HOST=production-db-server
PORT=3000
```

Use process manager:
```bash
npm install -g pm2
pm2 start server.js --name "unihub-api"
```

## 📚 Documentation

- **QUICKSTART.md** - Get started in 5 minutes
- **DATABASE_SETUP.md** - Detailed setup guide
- **INTEGRATION_SUMMARY.md** - Architecture overview

## 🧪 Testing

### Check Setup
```bash
node verify.js
```

### Test API
```bash
curl http://localhost:5000/api/universities
curl http://localhost:5000/api/health
```

### Test in Browser
```javascript
// Check API connection
testAPIConnection();

// Check database bridge
const db = getDatabase();
console.log('Connected:', db.isConnected());

// Get university
db.getUniversityById('iitu').then(uni => console.log(uni));
```

## 📝 License

ISC

## 👨‍💻 Author

GitHub: [@onigiri-eda](https://github.com/onigiri-eda/UniHUB)

## 🙏 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request

## 📞 Support

For issues and questions:
- Check documentation files
- Review troubleshooting section
- Check GitHub issues

---

**Ready to help students find their perfect university!** 🎓✨
