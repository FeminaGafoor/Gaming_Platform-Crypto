# 🎮 Gaming Platform - Agent & Affiliate Management System

A comprehensive full-stack gaming platform admin ecosystem featuring Agent Panel, Affiliate Panel, and Admin Panel with role-based access control, commission tracking, and withdrawal management system.

## 🚀 Live Demo

**Production URLs:**
- **Frontend (Vercel):** https://gaming-platform-crypto.vercel.app
- **Backend API (Railway):** https://gamingplatform-crypto-production.up.railway.app
- **API Documentation:** https://gamingplatform-crypto-production.up.railway.app/docs

**Demo Credentials:**
```
Agent:     agent@test.com / password123
Affiliate: affiliate@test.com / password123
Admin:     admin@test.com / password123
```

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Deployment](#-deployment)

---

## ✨ Features

### 🎯 Agent Panel

- ✅ **Dashboard**
  - Total players, active players count
  - Total earnings and withdrawable balance
  - 7-day earnings chart
  - Recent commission history

- ✅ **User Management**
  - Register new players
  - View player list with pagination
  - Player profile details (deposits, losses, status)
  - Block/Unblock players
  - Real-time status updates

- ✅ **Commission System**
  - 10% revenue share on player losses
  - Automatic commission calculation
  - Commission history with filters
  - Date-wise earnings breakdown
  - CSV export functionality

- ✅ **Withdrawal Management**
  - Request withdrawal ($50 minimum)
  - Track withdrawal status (Pending/Approved/Rejected)
  - Payment method selection
  - Automatic balance adjustment
  - Withdrawal history

---

### 🔗 Affiliate Panel

- ✅ **Dashboard**
  - Total clicks, registrations, conversions
  - Total earnings and withdrawable balance
  - Conversion rate analytics
  - Performance charts

- ✅ **Referral System**
  - Unique referral link generation
  - Custom referral codes
  - QR code for referral links
  - Short URL generation
  - Click tracking with IP logging

- ✅ **Tracking & Analytics**
  - Click history with timestamps
  - Conversion funnel visualization
  - Registration tracking
  - First deposit tracking
  - Performance reports by date range

- ✅ **Commission Management**
  - $50 CPA (Cost Per Acquisition)
  - Commission history
  - Earnings breakdown
  - Payment tracking

- ✅ **Withdrawals**
  - Request withdrawal ($100 minimum)
  - Withdrawal status tracking
  - Payment method options
  - Withdrawal history

- ✅ **Marketing Assets**
  - Downloadable banners
  - Social media templates (Twitter, Facebook)
  - Copy templates
  - Promotional materials

---

### 👨‍💼 Admin Panel

- ✅ **Withdrawal Management**
  - View all withdrawal requests (Agent + Affiliate)
  - Filter by status (Pending/Approved/Rejected/All)
  - Approve withdrawals with balance deduction
  - Reject withdrawals with reason
  - User details (email, role, amount)
  - Payment method tracking
  - Request timestamps

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 7.3.1
- **Styling:** TailwindCSS 3.4.17
- **Routing:** React Router DOM 7.1.3
- **HTTP Client:** Axios 1.7.9
- **Icons:** Lucide React 0.469.0
- **Charts:** Recharts 2.15.0

### Backend
- **Framework:** FastAPI 0.104.1
- **Database:** PostgreSQL 14
- **ORM:** SQLAlchemy 2.0.23
- **Authentication:** JWT (python-jose 3.3.0)
- **Password Hashing:** bcrypt 4.0.1
- **Validation:** Pydantic 2.5.2
- **Server:** Uvicorn 0.24.0

### DevOps & Deployment
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway
- **Database:** Railway PostgreSQL
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git & GitHub

---

## 🏗️ Architecture

```
gaming-platform/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── agent/          # Agent panel pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Players.jsx
│   │   │   │   ├── Commissions.jsx
│   │   │   │   └── Withdrawals.jsx
│   │   │   ├── affiliate/      # Affiliate panel pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ReferralLinks.jsx
│   │   │   │   ├── Clicks.jsx
│   │   │   │   ├── Conversions.jsx
│   │   │   │   ├── Commissions.jsx
│   │   │   │   ├── Withdrawals.jsx
│   │   │   │   └── Marketing.jsx
│   │   │   └── admin/          # Admin panel pages
│   │   │       └── Withdrawals.jsx
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── services/           # API integration
│   │   │   └── api.js          # Axios API client
│   │   └── App.jsx             # Main app with routing
│   ├── .env.example
│   ├── .env.production
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── models/             # SQLAlchemy ORM models
│   │   │   ├── user.py         # User authentication
│   │   │   ├── agent.py        # Agent profiles
│   │   │   ├── affiliate.py    # Affiliate profiles
│   │   │   ├── player.py       # Player management
│   │   │   ├── commission.py   # Commission records
│   │   │   ├── withdrawal.py   # Withdrawal requests
│   │   │   └── click.py        # Click tracking
│   │   ├── schemas/            # Pydantic validation
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.py         # Authentication
│   │   │   ├── agent.py        # Agent routes
│   │   │   ├── affiliate.py    # Affiliate routes
│   │   │   └── admin.py        # Admin routes
│   │   ├── services/           # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── agent_service.py
│   │   │   └── affiliate_service.py
│   │   ├── utils/              # Utilities
│   │   │   ├── security.py     # JWT & password hashing
│   │   │   └── dependencies.py # FastAPI dependencies
│   │   ├── config.py           # Settings & configuration
│   │   ├── database.py         # DB connection
│   │   └── main.py             # FastAPI application
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── railway.json            # Railway deployment config
│
└── README.md                    # This file
```

---

## 📊 Database Schema

### Tables (7)

1. **users** - Core authentication
   - `id`, `email`, `password_hash`, `role` (AGENT/AFFILIATE/ADMIN)
   - Relationships: agents, affiliates, withdrawals

2. **agents** - Agent profiles
   - `id`, `user_id`, `commission_rate`, `total_earnings`, `withdrawable_balance`
   - Relationships: players, commissions, withdrawals

3. **affiliates** - Affiliate profiles
   - `id`, `user_id`, `referral_code`, `total_clicks`, `total_conversions`, `cpa_amount`
   - Relationships: clicks, commissions, withdrawals

4. **players** - Player management
   - `id`, `agent_id`, `username`, `email`, `status`, `total_deposits`, `total_losses`
   - Relationships: agent, commissions

5. **commissions** - Earnings ledger
   - `id`, `agent_id/affiliate_id`, `amount`, `type`, `source_id`, `created_at`
   - Types: AGENT_COMMISSION, AFFILIATE_CPA, AFFILIATE_REVSHARE

6. **withdrawals** - Payout requests
   - `id`, `user_id`, `agent_id/affiliate_id`, `amount`, `status`, `payment_method`
   - Status: PENDING → APPROVED/REJECTED

7. **clicks** - Affiliate tracking
   - `id`, `affiliate_id`, `ip_address`, `user_agent`, `converted`, `clicked_at`

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL 14+ (or use Docker)
- Git

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/FeminaGafoor/Gaming_Platform-Crypto.git
cd Gaming_Platform-Crypto
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations (auto-create tables)
uvicorn app.main:app --reload

# Backend runs at http://localhost:8000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev

# Frontend runs at http://localhost:5173
```

#### 4. Using Docker (Recommended)
```bash
# Start all services
docker compose up -d

# Check logs
docker compose logs -f

# Stop services
docker compose down
```

---

## 📖 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123",
  "role": "agent"  // or "affiliate"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Agent Endpoints (Requires Agent JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agent/dashboard` | Dashboard statistics |
| GET | `/api/agent/players` | List players (paginated) |
| POST | `/api/agent/players` | Register new player |
| PUT | `/api/agent/players/{id}/toggle-status` | Block/unblock player |
| GET | `/api/agent/commissions` | Commission history |
| GET | `/api/agent/withdrawals` | Withdrawal history |
| POST | `/api/agent/withdrawals` | Request withdrawal |

### Affiliate Endpoints (Requires Affiliate JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/affiliate/dashboard` | Performance metrics |
| GET | `/api/affiliate/referral-link` | Get referral link |
| GET | `/api/affiliate/clicks` | Click history |
| GET | `/api/affiliate/conversions` | Converted players |
| GET | `/api/affiliate/commissions` | Earnings history |
| GET | `/api/affiliate/withdrawals` | Withdrawal history |
| POST | `/api/affiliate/withdrawals` | Request withdrawal |
| GET | `/api/affiliate/marketing-assets` | Marketing materials |

### Admin Endpoints (Requires Admin JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/withdrawals` | All withdrawal requests |
| PUT | `/api/admin/withdrawals/{id}/approve` | Approve withdrawal |
| PUT | `/api/admin/withdrawals/{id}/reject` | Reject withdrawal |

**Full API Documentation:** https://gamingplatform-crypto-production.up.railway.app/docs

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ JWT-based authentication with 30-minute expiry
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with role validation
- ✅ Secure password hashing (bcrypt, 12 rounds)

### API Security
- ✅ CORS configuration for specific origins
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Input validation (Pydantic schemas)
- ✅ Environment variable protection
- ✅ HTTPS enforcement in production

### Business Logic Security
- ✅ Balance validation before withdrawals
- ✅ Minimum withdrawal amounts
- ✅ Transaction-safe balance updates
- ✅ Admin approval workflow
- ✅ Status-based operation restrictions

---

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Import `Gaming_Platform-Crypto` repository

2. **Configure Build Settings**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://gamingplatform-crypto-production.up.railway.app
   ```

4. **Deploy!**
   - Vercel auto-deploys on git push

### Backend (Railway)

1. **Create New Project**
   - Go to https://railway.app
   - Create project from GitHub repo

2. **Configure Service**
   - Builder: Dockerfile
   - Root Directory: `backend`
   - Port: 8000

3. **Add PostgreSQL Database**
   - Add service → Database → PostgreSQL
   - Railway auto-sets `DATABASE_URL`

4. **Set Environment Variables**
   ```
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://gaming-platform-crypto.vercel.app
   FRONTEND_URL=https://gaming-platform-crypto.vercel.app
   BASE_URL=https://gaming-platform-crypto.vercel.app
   ```

5. **Generate Domain**
   - Settings → Networking → Generate Domain
   - Port: 8000

6. **Deploy!**
   - Railway auto-deploys on variable save

---

## 🧪 Testing

### Manual Testing (Recommended)

1. **Register accounts** for each role (agent, affiliate, admin)
2. **Test agent flow:**
   - Add players → View commissions → Request withdrawal
3. **Test affiliate flow:**
   - Get referral link → Track clicks → Request withdrawal
4. **Test admin flow:**
   - View pending withdrawals → Approve/reject

### API Testing (Postman/cURL)

```bash
# Example: Get agent dashboard
curl -X GET "https://gamingplatform-crypto-production.up.railway.app/api/agent/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Key Implementation Highlights

### Withdrawal Approval System
- Agents/Affiliates request withdrawals → Status: `PENDING`
- Balance NOT deducted on request (prevents fraud)
- Admin reviews and approves → Balance deducted → Status: `APPROVED`
- Admin rejects → Balance unchanged → Status: `REJECTED`

### Commission Calculation
- **Agent:** 10% of player losses, calculated automatically
- **Affiliate:** $50 CPA on first deposit per referred player
- Tracked in `commissions` table with full audit trail

### Role-Based UI
- Different sidebar menus for Agent/Affiliate/Admin
- Protected routes redirect unauthorized users
- Dynamic dashboard based on user role

---

## 📝 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000  # Local development
# VITE_API_URL=https://gamingplatform-crypto-production.up.railway.app  # Production
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/gaming_platform
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,https://gaming-platform-crypto.vercel.app
FRONTEND_URL=https://gaming-platform-crypto.vercel.app
BASE_URL=https://gaming-platform-crypto.vercel.app
```

---

## 👨‍💻 Developer

**Femina Azeez**
Full-Stack Developer | Dubai, UAE

- **GitHub:** [@FeminaGafoor](https://github.com/FeminaGafoor)
- **Project Repository:** [Gaming_Platform-Crypto](https://github.com/FeminaGafoor/Gaming_Platform-Crypto)
- **Live Demo:** [gaming-platform-crypto.vercel.app](https://gaming-platform-crypto.vercel.app)

---

## 🎓 Skills Demonstrated

- ✅ Full-stack development (React + FastAPI)
- ✅ RESTful API design and implementation
- ✅ Database design and ORM usage (SQLAlchemy)
- ✅ Authentication & authorization (JWT, RBAC)
- ✅ Modern frontend (React, Vite, TailwindCSS)
- ✅ State management (React Context)
- ✅ API integration (Axios)
- ✅ Responsive UI design
- ✅ Git version control & GitHub collaboration
- ✅ Docker containerization
- ✅ Cloud deployment (Vercel, Railway)
- ✅ Security best practices
- ✅ Clean code architecture
- ✅ API documentation (OpenAPI/Swagger)

---

## 📄 License

MIT License - Free to use for educational and commercial purposes.

---

## 📞 Support

For questions or issues:
- Open an issue on [GitHub](https://github.com/FeminaGafoor/Gaming_Platform-Crypto/issues)
- Check API documentation at `/docs`

---

**Built as a technical assessment for iGaming platform development position**

_Last Updated: February 2026_

---

## 🙏 Acknowledgments

- FastAPI for excellent documentation
- React & Vite for modern frontend tooling
- Railway & Vercel for seamless deployments
- TailwindCSS for rapid UI development

---

**⭐ If you found this project helpful, please give it a star on GitHub!**
