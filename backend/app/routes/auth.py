"""
Authentication routes - login and registration.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..services.auth_service import AuthService
from ..models.user import UserRole

# Remove the prefix here - it's added in main.py
router = APIRouter()


# Request/Response Models
class RegisterRequest(BaseModel):
    """Registration request body"""
    email: EmailStr
    password: str
    role: str  # "agent" or "affiliate"
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "agent@example.com",
                "password": "securepassword123",
                "role": "agent"
            }
        }


class LoginRequest(BaseModel):
    """Login request body"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "agent@example.com",
                "password": "securepassword123"
            }
        }


class TokenResponse(BaseModel):
    """Token response with user info"""
    access_token: str
    token_type: str = "bearer"
    user: dict


# Routes
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user (agent or affiliate).
    
    Story: Someone fills out the signup form
    We validate their info, create their account, and log them in
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.register(
            email=request.email,
            password=request.password,
            role=request.role
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login and get access token.
    
    Story: User enters their credentials
    We verify them and give them a session token
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.login(
            email=request.email,
            password=request.password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/test")
async def test():
    """Test endpoint to verify auth routes are working"""
    return {"message": "Auth routes are working!"}
