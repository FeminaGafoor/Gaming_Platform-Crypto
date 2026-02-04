"""
FastAPI dependencies for authentication and authorization.

Think of these as security checkpoints:
- They verify the user's ticket (JWT token)
- They check if user has the right role (agent/affiliate)
- They fetch user data from database
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models.user import User, UserRole
from ..models.agent import Agent
from ..models.affiliate import Affiliate
from .security import decode_access_token

# HTTP Bearer token scheme (Authorization: Bearer <token>)
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user.
    
    Story: User makes a request with their ticket (JWT token)
    We verify the ticket and fetch their full profile from database
    If ticket is invalid or expired, we reject them
    
    This is used on EVERY protected route.
    
    Args:
        credentials: Bearer token from Authorization header
        db: Database session
        
    Returns:
        User object if authenticated
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    # Extract token from credentials
    token = credentials.credentials
    
    # Decode and verify token
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user email from token
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


def get_current_agent(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Agent:
    """
    Get the current user's agent profile.
    
    Story: Some routes are only for agents (like managing players)
    This dependency checks:
    1. User is authenticated (via get_current_user)
    2. User's role is AGENT
    3. Fetches their agent profile
    
    Args:
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Agent object
        
    Raises:
        HTTPException: If user is not an agent
    """
    if current_user.role != UserRole.AGENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can access this resource"
        )
    
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    
    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent profile not found"
        )
    
    return agent


def get_current_affiliate(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Affiliate:
    """
    Get the current user's affiliate profile.
    
    Story: Some routes are only for affiliates (like tracking clicks)
    This dependency checks:
    1. User is authenticated
    2. User's role is AFFILIATE
    3. Fetches their affiliate profile
    
    Args:
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Affiliate object
        
    Raises:
        HTTPException: If user is not an affiliate
    """
    if current_user.role != UserRole.AFFILIATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only affiliates can access this resource"
        )
    
    affiliate = db.query(Affiliate).filter(
        Affiliate.user_id == current_user.id
    ).first()
    
    if affiliate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate profile not found"
        )
    
    return affiliate