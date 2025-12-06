# 🎓 UniHUB - University Selection System
## GROK AI Chatbot + ML Recommendation Engine

### ✅ COMPLETED FEATURES

**🤖 GROK AI Chatbot**
- Integration with GROK API (xAI)
- PostgreSQL database context integration
- University comparison feature ("сравни IITU и KBTU")
- Real-time responses in Russian
- Chat widget with persistent history

**🧠 ML Recommendation Engine**
- Decision Tree algorithm (not TensorFlow)
- 200+ training scenarios
- Fast predictions (~50ms)
- Confidence scoring (0-100%)
- 5-parameter analysis

**📊 PostgreSQL Backend**
- Express.js API server on port 5000
- Connection pooling
- Query caching (5-minute TTL)
- 10+ REST endpoints
- Optimized performance

**✨ Features & Optimizations**
- Fast server startup (3-5 seconds)
- Async chat data loading (non-blocking)
- Limited query results (no data overload)
- Database query caching
- Responsive UI design

## 📦 Project Structure

### Backend
- ✅ `server.js` - Express.js API with optimized endpoints
- ✅ PostgreSQL integration with caching

### Frontend
- ✅ `js/chat.js` - 🤖 GROK chatbot integration
- ✅ `js/ml-recommendation.js` - Decision Tree engine
- ✅ `js/main.js` - Survey form handler
- ✅ `js/api-service.js` - API client

### Documentation
- ✅ `ML_EXPLANATION.txt` - Detailed ML algorithm docs
- ✅ `GROK_CHATBOT_INTEGRATION.txt` - Chatbot architecture
- ✅ `README.md` - This file

## 🚀 Quick Start

### Requirements
- Node.js 14+
- PostgreSQL 12+
- npm

### Installation (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Ensure PostgreSQL running with database "unichoice"
psql -U postgres -d unichoice

# 3. Start server
node server.js

# 4. Open in browser
http://localhost:5000/index.html
```

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server status check |
| `/api/universities` | GET | Get all universities |
| `/api/all-data` | GET | Full DB data for chatbot |
| `/api/compare-universities?uni1=X&uni2=Y` | GET | Compare two universities |

## 🤖 Chatbot Features

**Start Chatting:**
1. Click chat button (💬) in bottom right
2. Type questions about universities
3. Get instant GROK AI answers
4. Type "сравни IITU и KBTU" to compare

**Examples:**
- "Какие программы в IITU?" (What programs at IITU?)
- "сравни AITU и KBTU" (Compare AITU and KBTU)
- "Требования для поступления?" (Admission requirements?)

## 🧠 ML Recommendation

**Take Survey:**
1. Click "Начать опрос" (Start Survey)
2. Answer 5 questions
3. Get university recommendation with confidence score

**Algorithm:**
- Decision Tree classification
- Multi-level scoring system
- 200+ training scenarios
- Confidence: 0-100%

## 📊 Performance

- **Server Startup:** 3-5 seconds
- **Chat Load:** 100-200ms (first), 50ms (cached)
- **API Response:** 50-300ms
- **Database Query Cache:** 5 minutes

## 🛠️ Troubleshooting

**Server won't start?**
```bash
# Check if port 5000 in use
Get-Process node | Stop-Process -Force
node server.js
```

**Database error?**
```bash
# Verify PostgreSQL running
psql -U postgres -d unichoice

# Check .env credentials
# DB_USER=postgres
# DB_PASSWORD=1234
# DB_HOST=localhost
# DB_PORT=5432
```

**Chat not responding?**
- Open browser console (F12)
- Check for JavaScript errors
- Ensure server running

## 📁 Project Structure

```
UniHUB/
├── index.html          # Main survey page
├── server.js           # Express.js backend
├── .env                # Configuration
├── package.json        # Dependencies
├── css/
│   └── styles.css      # Styling
├── js/
│   ├── chat.js         # 🤖 GROK Chatbot
│   ├── ml-recommendation.js  # 🧠 ML Engine
│   ├── main.js         # Survey handler
│   └── api-service.js  # API client
└── Documentation
    ├── README.md       # This file
    ├── ML_EXPLANATION.txt
    └── GROK_CHATBOT_INTEGRATION.txt
```

## 📝 Configuration

Create or update `.env`:
```
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unichoice
PORT=5000
```

## ✨ Features

✅ GROK AI Chatbot with database context
✅ University comparison feature
✅ ML decision tree recommendation engine
✅ PostgreSQL backend with caching
✅ Responsive design
✅ Fast performance
✅ Production ready

## 📚 Documentation

- **ML_EXPLANATION.txt** - Detailed ML algorithm documentation
- **GROK_CHATBOT_INTEGRATION.txt** - Chatbot architecture and API details

## 🚀 Ready to Go!

```bash
npm start
# Open http://localhost:5000/index.html
```

---

*UniHUB v2.0 - GROK AI Chatbot + ML Recommendation Engine*
*Production Ready ✅*
