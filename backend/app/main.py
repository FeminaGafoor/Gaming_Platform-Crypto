"""
Main FastAPI application.

Think of this as the restaurant manager:
- Opens the doors (starts the server)
- Sets up the dining room (CORS, middleware)
- Organizes service counters (routes)
- Manages the kitchen (database)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .config import settings
from .routes import auth_router, agent_router, affiliate_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    
    Story: What happens when restaurant opens and closes?
    - Startup: Create database tables if they don't exist
    - Shutdown: Clean up resources
    
    This runs once at startup and once at shutdown.
    """
    # Startup: Create all database tables
    print("🚀 Starting Gaming Platform API...")
    print("📊 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    yield  # Application runs here
    
    # Shutdown: Cleanup (if needed)
    print("👋 Shutting down Gaming Platform API...")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    Gaming Platform API - Agent and Affiliate Management System
    
    ## Features
    
    ### Agent Panel
    * Manage players (register, view, block/unblock)
    * Track commissions and earnings
    * Request withdrawals
    * View dashboard statistics
    
    ### Affiliate Panel
    * Generate unique referral links
    * Track clicks and conversions
    * Monitor earnings (CPA model)
    * Request payouts
    * Access marketing materials
    
    ## Authentication
    
    All protected endpoints require a Bearer token in the Authorization header:
```
    Authorization: Bearer <your_access_token>
```
    
    Get your token by registering or logging in through `/api/auth` endpoints.
    """,
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc UI
)


# Configure CORS (Cross-Origin Resource Sharing)
# This allows frontend (React/Next.js) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,  # Your frontend URL
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Alternative local port
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Include routers (API endpoints)
app.include_router(auth_router)
app.include_router(agent_router)
app.include_router(affiliate_router)


# Root endpoint
@app.get("/")
def read_root():
    """
    Root endpoint - API health check.
    
    Story: Someone visits the base URL
    We welcome them and show basic info
    """
    return {
        "message": "Welcome to Gaming Platform API",
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "auth": "/api/auth",
            "agent": "/api/agent",
            "affiliate": "/api/affiliate"
        }
    }


# Health check endpoint (for monitoring tools)
@app.get("/health")
def health_check():
    """
    Health check endpoint.
    
    Used by monitoring tools (Docker, Kubernetes, load balancers)
    to check if the service is alive.
    """
    return {
        "status": "healthy",
        "service": "gaming-platform-api",
        "version": settings.VERSION
    }