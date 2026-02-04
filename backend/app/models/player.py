from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class PlayerStatus(enum.Enum):
    """Player account status"""
    ACTIVE = "active"
    BLOCKED = "blocked"
    SUSPENDED = "suspended"

class Player(Base):
    """
    Players (customers) registered by agents or affiliates.
    
    Think of this as the customer database.
    Each player plays games and generates revenue.
    """
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Who manages this player?
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    
    # Who referred this player? (can be None if direct agent signup)
    affiliate_id = Column(Integer, ForeignKey("affiliates.id"), nullable=True)
    
    # Player info
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    
    # Account status
    status = Column(Enum(PlayerStatus), default=PlayerStatus.ACTIVE)
    
    # Financial tracking
    total_deposits = Column(Float, default=0.0)
    total_withdrawals = Column(Float, default=0.0)
    total_bets = Column(Float, default=0.0)
    total_wins = Column(Float, default=0.0)
    total_losses = Column(Float, default=0.0)
    
    # Tracking
    registration_ip = Column(String, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="players")
    affiliate = relationship("Affiliate", back_populates="players")
    commissions = relationship("Commission", back_populates="player")