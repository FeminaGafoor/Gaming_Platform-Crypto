from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Click(Base):
    """
    Click tracking for affiliates.
    
    Think of this as Google Analytics for affiliate links.
    Every click on an affiliate's link is recorded here.
    """
    __tablename__ = "clicks"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Which affiliate's link was clicked?
    affiliate_id = Column(Integer, ForeignKey("affiliates.id"), nullable=False)
    
    # Tracking info
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)  # Browser info
    referrer = Column(String, nullable=True)     # Where they came from
    
    # Did this click convert? (did they register/deposit?)
    converted = Column(Boolean, default=False)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    
    # When did they click?
    clicked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    affiliate = relationship("Affiliate", back_populates="clicks")