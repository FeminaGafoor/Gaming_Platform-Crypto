"""
Authentication service - handles user registration and login.

Think of this as the HR department:
- Registers new employees (users)
- Verifies credentials during login
- Issues access tokens
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta

from ..models.user import User, UserRole
from ..models.agent import Agent
from ..models.affiliate import Affiliate
from ..utils.security import verify_password, get_password_hash, create_access_token
from ..config import settings


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def register_user(
        email: str,
        password: str,
        role: UserRole,
        db: Session
    ) -> dict:
        """
        Register a new user (agent or affiliate).
        
        Story: Someone wants to join as agent/affiliate
        We create their account, hash their password, and create their profile
        
        Args:
            email: User's email
            password: Plain password (will be hashed)
            role: AGENT or AFFILIATE
            db: Database session
            
        Returns:
            Dictionary with user info and access token
        """
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        user = User(
            email=email,
            password_hash=get_password_hash(password),
            role=role
        )
        db.add(user)
        db.flush()  # Get user.id without committing yet
        
        # Create role-specific profile
        if role == UserRole.AGENT:
            agent = Agent(user_id=user.id)
            db.add(agent)
        elif role == UserRole.AFFILIATE:
            affiliate = Affiliate(
                user_id=user.id,
                referral_code=Affiliate.generate_referral_code()
            )
            db.add(affiliate)
        
        db.commit()
        db.refresh(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role.value
            }
        }
    
    @staticmethod
    def login(email: str, password: str, db: Session) -> dict:
        """
        Authenticate user and return access token.
        
        Story: User wants to log in
        We check if email exists and password matches
        If yes, we give them a session token
        
        Args:
            email: User's email
            password: Plain password to verify
            db: Database session
            
        Returns:
            Dictionary with access token and user info
        """
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role.value
            }
        }