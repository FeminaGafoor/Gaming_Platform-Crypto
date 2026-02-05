from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Withdrawal(Base):
    """
    Withdrawal requests from agents/affiliates.
    """
    __tablename__ = "withdrawals"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Who's requesting withdrawal?
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # ✅ ADDED: Track source (agent or affiliate)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    affiliate_id = Column(Integer, ForeignKey("affiliates.id"), nullable=True)
    
    # Amount and status
    amount = Column(Float, nullable=False)
    status = Column(String, default="PENDING")  # ✅ Using String instead of Enum

    # Payment details
    payment_method = Column(String, nullable=True)
    payment_details = Column(String, nullable=True)

    # Admin approval fields
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String, nullable=True)
    admin_notes = Column(String, nullable=True)

    # Timestamps
    requested_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="withdrawals", foreign_keys=[user_id])