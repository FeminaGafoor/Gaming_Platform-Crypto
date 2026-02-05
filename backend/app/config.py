from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database - ✅ Now supports PostgreSQL
    DATABASE_URL: str
    
    # JWT Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Support multiple origins for development and production
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,https://gaming-platform-crypto.vercel.app"  # Comma-separated list
    
    # App Settings
    BASE_URL: str = "http://localhost:5173"  # Base URL for referral links
    PROJECT_NAME: str = "Gaming Platform API"
    VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    """Cached settings instance"""
    return Settings()

settings = get_settings()