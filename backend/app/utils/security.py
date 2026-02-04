"""
Security utilities for password hashing and JWT token management.

Think of this as your security team:
- Password hashing: Encrypts passwords (one-way, can't be decrypted)
- JWT tokens: Creates and verifies session tokens
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings

# Password hashing context
# bcrypt is the industry standard for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Story: When user logs in, they type "mypassword123"
    We compare it with the stored hash "$2b$12$..." 
    Returns True if they match, False if not.
    
    Args:
        plain_password: The password user typed
        hashed_password: The stored hash from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plain password.
    
    Story: When user registers with "mypassword123"
    We convert it to "$2b$12$randomhash..." before storing
    This is one-way - you can't get the original password back!
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Story: After successful login, we give user a "ticket" (JWT token)
    This ticket contains their user info and expiry time
    They show this ticket for every request instead of typing password again
    
    Args:
        data: Dictionary containing user info (usually user_id, email, role)
        expires_delta: How long until ticket expires (default: 30 minutes)
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Set expiry time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    # Add expiry to the token data
    to_encode.update({"exp": expire})
    
    # Encode and sign the token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token.
    
    Story: User shows their "ticket" (JWT token)
    We check if it's valid, not expired, and signed by us
    If valid, we extract the user info from it
    
    Args:
        token: JWT token string
        
    Returns:
        Dictionary with user data if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None