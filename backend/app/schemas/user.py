from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from ..models.user import UserRole

class UserBase(BaseModel):
    """
    Base user schema - common fields.
    Think of this as the basic info everyone needs to provide.
    """
    email: EmailStr  # EmailStr automatically validates email format!

class UserCreate(UserBase):
    """
    Schema for creating a new user (registration).
    
    Like a registration form:
    - Email (must be valid format)
    - Password (minimum 8 characters)
    - Role (agent or affiliate)
    """
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    role: UserRole  # Must be 'agent' or 'affiliate'
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "agent@example.com",
                "password": "securepass123",
                "role": "agent"
            }
        }
    )

class UserLogin(BaseModel):
    """
    Schema for user login.
    Simple: just email and password.
    """
    email: EmailStr
    password: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "agent@example.com",
                "password": "securepass123"
            }
        }
    )

class UserResponse(UserBase):
    """
    Schema for returning user data (NEVER include password!).
    
    This is what the API sends back after login/registration.
    Notice: NO password field - security!
    """
    id: int
    role: UserRole
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
    # from_attributes=True allows creating from SQLAlchemy models

class Token(BaseModel):
    """
    JWT token response after successful login.
    Like receiving your hotel room key card.
    """
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """
    Data stored inside JWT token.
    Like the magnetic strip on your hotel key card - contains your room number.
    """
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None