# Gaming Platform - Agent & Affiliate Management System

A professional backend API for managing gaming platform agents and affiliates, built with FastAPI, PostgreSQL, and Docker.

## 🚀 Live Demo

- **API Documentation:** http://localhost:8000/docs
- **API Endpoint:** http://localhost:8000

## 📹 Demo Video

[Coming soon - 3-minute walkthrough]

## ✨ Features

### 🎯 Agent Panel
- ✅ User management (register, view, block/unblock players)
- ✅ Real-time commission tracking (10% revenue share)
- ✅ Withdrawal request system with approval workflow
- ✅ Dashboard with 7-day earnings charts
- ✅ Player activity monitoring
- ✅ CSV export functionality

### 🔗 Affiliate Panel
- ✅ Unique referral link generation with tracking codes
- ✅ Click and conversion tracking with IP logging
- ✅ CPA commission model ($50 per first deposit)
- ✅ Performance analytics and reports
- ✅ Marketing assets library (banners, copy templates)
- ✅ Revenue share calculations
- ✅ Conversion funnel visualization

## 🛠️ Tech Stack

**Backend:**
- FastAPI 0.104.1 (High-performance Python web framework)
- PostgreSQL 14 (Relational database)
- SQLAlchemy 2.0.23 (ORM)
- JWT Authentication (python-jose)
- bcrypt (Password hashing)
- Pydantic (Data validation)

**DevOps:**
- Docker & Docker Compose
- Uvicorn (ASGI server)

**API Documentation:**
- Auto-generated Swagger UI (OpenAPI 3.1)
- ReDoc

## 🏗️ Architecture
```
gaming-platform/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy database models (7 tables)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── routes/          # API endpoint definitions
│   │   │   ├── auth.py      # Authentication (register, login)
│   │   │   ├── agent.py     # Agent panel endpoints (7 routes)
│   │   │   └── affiliate.py # Affiliate panel endpoints (10 routes)
│   │   ├── services/        # Business logic layer
│   │   │   ├── auth_service.py
│   │   │   ├── agent_service.py
│   │   │   └── affiliate_service.py
│   │   ├── utils/           # Utilities (security, dependencies)
│   │   ├── config.py        # Application configuration
│   │   ├── database.py      # Database connection & session
│   │   └── main.py          # FastAPI application
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## 📊 Database Schema

**7 Tables with Relationships:**

- **users** - Core authentication (email, password_hash, role)
- **agents** - Agent profiles (commission_rate, earnings, balance)
- **affiliates** - Affiliate profiles (referral_code, clicks, conversions)
- **players** - Customer management (deposits, losses, status)
- **commissions** - Earnings ledger (amount, type, timestamps)
- **withdrawals** - Payout requests (amount, status, payment details)
- **clicks** - Affiliate tracking (IP, user_agent, conversion status)

**Enum Types:**
- UserRole (AGENT, AFFILIATE, ADMIN)
- PlayerStatus (ACTIVE, BLOCKED, SUSPENDED)
- CommissionType (AGENT_COMMISSION, AFFILIATE_CPA, AFFILIATE_REVSHARE)
- WithdrawalStatus (PENDING, APPROVED, REJECTED, PROCESSED)

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)
- Git

### Installation
```bash
# 1. Clone repository
git clone https://github.com/FeminaGafoor/Gaming_Platform-Crypto.git
cd Gaming_Platform-Crypto

# 2. Start all services
docker compose up -d

# 3. Check backend logs
docker compose logs -f backend

# 4. Wait for "✅ Database tables created successfully!"

# 5. Access API documentation
open http://localhost:8000/docs
```

### Stopping Services
```bash
docker compose down
```

### Reset Database
```bash
docker compose down -v
docker compose up -d
```

## 🧪 Testing the API

### Option 1: Swagger UI (Recommended)

1. Open http://localhost:8000/docs
2. Test each endpoint interactively
3. View request/response examples

### Option 2: cURL Commands

**Register Agent:**
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@test.com",
    "password": "password123",
    "role": "agent"
  }'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@test.com",
    "password": "password123"
  }'
```

**Get Agent Dashboard (use token from login):**
```bash
curl -X GET "http://localhost:8000/api/agent/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new agent/affiliate account
- `POST /api/auth/login` - Get JWT access token
- `GET /api/auth/test` - Health check

### Agent Panel (Requires Agent Token)
- `GET /api/agent/dashboard` - Stats, charts, KPIs
- `POST /api/agent/players` - Register new player
- `GET /api/agent/players` - List players (paginated)
- `PUT /api/agent/players/{id}/toggle-status` - Block/unblock player
- `GET /api/agent/commissions` - Commission history
- `GET /api/agent/withdrawals` - Withdrawal requests
- `POST /api/agent/withdrawals` - Request payout

### Affiliate Panel (Requires Affiliate Token)
- `GET /api/affiliate/dashboard` - Performance metrics
- `GET /api/affiliate/referral-link` - Get unique tracking link
- `POST /api/affiliate/track-click` - Record click event
- `GET /api/affiliate/clicks` - Click history
- `GET /api/affiliate/conversions` - Converted players
- `GET /api/affiliate/commissions` - Earnings history
- `GET /api/affiliate/withdrawals` - Payout requests
- `POST /api/affiliate/withdrawals` - Request withdrawal
- `POST /api/affiliate/performance-report` - Date range analytics
- `GET /api/affiliate/marketing-assets` - Promotional materials

### System
- `GET /` - API information
- `GET /health` - Health check

## 🔒 Security Features

- ✅ **Password Hashing:** bcrypt with 12 rounds
- ✅ **JWT Tokens:** 30-minute expiry, HS256 algorithm
- ✅ **Role-Based Access Control (RBAC):** Agent/Affiliate/Admin roles
- ✅ **SQL Injection Prevention:** SQLAlchemy ORM parameterized queries
- ✅ **CORS Configuration:** Restricts cross-origin requests
- ✅ **Input Validation:** Pydantic schemas on all endpoints
- ✅ **Environment Variables:** Sensitive data in .env (not committed)

## 🎯 Key Features Implemented

### Commission System
- **Agents:** 10% revenue share on player losses
- **Affiliates:** $50 CPA (Cost Per Acquisition) per first deposit
- Automatic calculation and balance updates
- Transaction-safe wallet operations

### Withdrawal System
- Request → Pending → Admin Approval → Processed flow
- Minimum withdrawal amounts (Agent: $50, Affiliate: $100)
- Balance locking during pending requests
- Payment method flexibility (bank, crypto, PayPal)

### Tracking System (Affiliates)
- Unique referral codes (e.g., "FEM2024")
- IP address and user-agent logging
- Click-to-conversion funnel tracking
- Performance analytics with date ranges

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL container is running
docker compose ps

# View database logs
docker compose logs db
```

### Backend Not Starting
```bash
# View backend logs
docker compose logs backend

# Rebuild containers
docker compose down
docker compose up --build -d
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Backend: 8000 → 8001
# Database: 5432 → 5433
```

## 📝 Environment Variables

Create `.env` file in `backend/` directory:
```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/gaming_platform
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Option 1: Render (Free Tier)
1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

### Option 2: Railway
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

### Option 3: DigitalOcean App Platform
1. Create new App from GitHub
2. Configure build settings
3. Add PostgreSQL database
4. Deploy

## 📚 Additional Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/openapi.json

## 👨‍💻 Developer

**Femina Azeez**  
AI Engineer | Full-Stack Developer | Dubai, UAE

- **GitHub:** [@FeminaGafoor](https://github.com/FeminaGafoor)
- **LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/YOUR_PROFILE)
- **Email:** [Your Email]

## 🎓 Skills Demonstrated

- ✅ FastAPI backend development
- ✅ PostgreSQL database design
- ✅ RESTful API architecture
- ✅ JWT authentication & authorization
- ✅ Docker containerization
- ✅ Git version control
- ✅ API documentation
- ✅ Security best practices
- ✅ Clean code architecture

## 📄 License

MIT License - see LICENSE file for details

---

**Built as a technical assessment for iGaming platform development position**

_Last Updated: February 2026_
