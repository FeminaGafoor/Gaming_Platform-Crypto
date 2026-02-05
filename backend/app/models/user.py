from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class UserRole(enum.Enum):
    """
    User roles in the system.
    Think of this as job titles in a company.
    """
    AGENT = "AGENT"
    AFFILIATE = "AFFILIATE"
    ADMIN = "ADMIN"

class User(Base):
    """
    The main users table - everyone who can log in.
    
    Think of this as the company's employee directory.
    Everyone has a badge (id), email, and role.
    """
    __tablename__ = "users"
    
    # Primary Key - unique ID for each user
    id = Column(Integer, primary_key=True, index=True)
    
    # Email - must be unique (no two users with same email)
    email = Column(String, unique=True, index=True, nullable=False)
    
    # Password hash - NEVER store plain passwords!
    # This is the encrypted version
    password_hash = Column(String, nullable=False)
    
    # Role - what type of user?
    role = Column(Enum(UserRole), nullable=False)
    
    # Timestamps - when created
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships - connections to other tables
    # Think of these as "this user's related records"
    agent = relationship("Agent", back_populates="user", uselist=False)
    affiliate = relationship("Affiliate", back_populates="user", uselist=False)
    withdrawals = relationship("Withdrawal", back_populates="user", foreign_keys="[Withdrawal.user_id]")