from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import secrets

class Affiliate(Base):
    """
    Affiliate-specific information.
    
    Think of this as the "Marketing Department" records.
    Each affiliate promotes the platform and earns from referrals.
    """
    __tablename__ = "affiliates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key - which user is this affiliate?
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Unique referral code (e.g., "FEM2024DUBAI")
    referral_code = Column(String, unique=True, nullable=False, index=True)
    
    # Tracking stats
    total_clicks = Column(Integer, default=0)
    total_registrations = Column(Integer, default=0)
    total_conversions = Column(Integer, default=0)  # Players who deposited
    
    # Financial tracking
    total_earnings = Column(Float, default=0.0)
    withdrawable_balance = Column(Float, default=0.0)
    
    # Commission type (cpa, revshare, hybrid)
    commission_type = Column(String, default="cpa")
    cpa_amount = Column(Float, default=50.0)  # $50 per conversion
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="affiliate")
    players = relationship("Player", back_populates="affiliate")
    clicks = relationship("Click", back_populates="affiliate")
    commissions = relationship("Commission", back_populates="affiliate")
    
    @staticmethod
    def generate_referral_code():
        """
        Generate a unique 8-character referral code.
        Like creating a unique promo code for each marketer.
        """
        return secrets.token_urlsafe(6).upper()[:8]