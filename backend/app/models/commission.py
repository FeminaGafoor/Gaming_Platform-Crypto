from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class CommissionType(enum.Enum):
    """Types of commission"""
    AGENT_COMMISSION = "agent_commission"
    AFFILIATE_CPA = "affiliate_cpa"
    AFFILIATE_REVSHARE = "affiliate_revshare"

class Commission(Base):
    """
    Commission records - tracks all earnings.
    
    Think of this as the payroll ledger.
    Every time someone earns money, we record it here.
    """
    __tablename__ = "commissions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Who earned this commission?
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    affiliate_id = Column(Integer, ForeignKey("affiliates.id"), nullable=True)
    
    # Which player generated this?
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    
    # Commission details
    commission_type = Column(Enum(CommissionType), nullable=False)
    amount = Column(Float, nullable=False)
    
    # Description (e.g., "Commission on player loss of $1000")
    description = Column(String, nullable=True)
    
    # When was this earned?
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="commissions")
    affiliate = relationship("Affiliate", back_populates="commissions")
    player = relationship("Player", back_populates="commissions")