"""
Authentication routes - login and registration.

Think of this as the reception desk:
- New users sign up here
- Existing users log in here
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..services.auth_service import AuthService
from ..models.user import UserRole

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# Request/Response Models (Pydantic schemas)
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


class AuthResponse(BaseModel):
    """Authentication response"""
    access_token: str
    token_type: str
    user: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "email": "agent@example.com",
                    "role": "agent"
                }
            }
        }


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user (agent or affiliate).
    
    Story: Someone fills out the signup form
    We validate their info, create their account, and log them in
    
    - **email**: Must be unique and valid
    - **password**: Will be hashed before storing
    - **role**: Either "agent" or "affiliate"
    
    Returns access token for immediate login.
    """
    # Convert role string to enum
    try:
        role_enum = UserRole.AGENT if request.role.lower() == "agent" else UserRole.AFFILIATE
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'agent' or 'affiliate'"
        )
    
    # Register user
    result = AuthService.register_user(
        email=request.email,
        password=request.password,
        role=role_enum,
        db=db
    )
    
    return result


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login with email and password.
    
    Story: User enters their credentials
    We verify them and give them a session token
    
    - **email**: User's registered email
    - **password**: User's password
    
    Returns access token for authenticated requests.
    """
    result = AuthService.login(
        email=request.email,
        password=request.password,
        db=db
    )
    
    return result


@router.get("/test")
def test_endpoint():
    """
    Test endpoint to verify API is running.
    
    Story: Quick health check - is the server alive?
    """
    return {
        "message": "Gaming Platform API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }