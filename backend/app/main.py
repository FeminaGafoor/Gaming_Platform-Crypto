


from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
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
# Split and strip whitespace from origins
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
print(f"🔐 CORS allowed origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint that verifies database connectivity.
    Railway uses this to determine if the application is healthy.
    """
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
