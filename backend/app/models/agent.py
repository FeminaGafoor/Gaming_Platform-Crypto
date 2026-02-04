from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Agent(Base):
    """
    Agent-specific information.
    
    Think of this as the "Sales Department" records.
    Each agent manages players and earns commissions.
    """
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key - links to users table
    # This means: "Which user is this agent?"
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Commission rate (e.g., 0.10 = 10%)
    commission_rate = Column(Float, default=0.10)
    
    # Financial tracking
    total_earnings = Column(Float, default=0.0)
    withdrawable_balance = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="agent")
    players = relationship("Player", back_populates="agent")
    commissions = relationship("Commission", back_populates="agent")