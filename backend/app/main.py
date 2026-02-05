


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .routes import auth, agent, affiliate, admin
from .config import get_settings



settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Gaming Platform API...")
    print("📊 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    yield
    print("👋 Shutting down...")

app = FastAPI(
    title="Gaming Platform API",
    description="Agent and Affiliate Management System",
    version="1.0.0",
    lifespan=lifespan
)

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-vercel-domain.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(agent.router, prefix="/api/agent", tags=["Agent"])
app.include_router(affiliate.router, prefix="/api/affiliate", tags=["Affiliate"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {
        "message": "Gaming Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
