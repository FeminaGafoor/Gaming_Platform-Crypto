# 🎮 Gaming Platform - Agent & Affiliate Management System

A full-stack iGaming platform for managing agents, affiliates, players, commissions, and payouts.

## 🏗️ Architecture

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** FastAPI (Python 3.12)
- **Database:** PostgreSQL 14
- **Authentication:** JWT tokens
- **Deployment:** Vercel (Frontend) + Railway (Backend)

## 🚀 Live Demo

- **Frontend:** https://gaming-platform.vercel.app
- **Backend API:** https://gaming-platform-api.railway.app
- **API Documentation:** https://gaming-platform-api.railway.app/docs

## ✨ Features

### Agent Panel
- ✅ Dashboard with KPIs and charts
- ✅ Player management (add, block, view)
- ✅ Commission tracking (10% on player losses)
- ✅ Withdrawal system with approval flow
- ✅ CSV export for earnings

### Affiliate Panel
- ✅ Unique referral link generation
- ✅ Click tracking and analytics
- ✅ Conversion funnel (clicks → registrations → deposits)
- ✅ CPA-based earnings ($50 per deposit)
- ✅ Marketing assets and QR codes

## 🛠️ Tech Stack

### Frontend
- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- React Router 6
- Recharts (for graphs)
- Lucide React (icons)
- Axios

### Backend
- FastAPI 0.104
- SQLAlchemy 2.0
- PostgreSQL 14
- Pydantic v2
- Python-JOSE (JWT)
- Bcrypt (password hashing)
- Alembic (migrations)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL 14+

### Local Development

#### 1. Clone Repository
```bash