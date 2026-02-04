from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class WithdrawalStatus(enum.Enum):
    """Withdrawal request status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PROCESSED = "processed"

class Withdrawal(Base):
    """
    Withdrawal requests from agents/affiliates.
    
    Think of this as salary/payment requests.
    User requests → Admin approves → Money sent
    """
    __tablename__ = "withdrawals"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Who's requesting withdrawal?
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Amount and status
    amount = Column(Float, nullable=False)
    status = Column(Enum(WithdrawalStatus), default=WithdrawalStatus.PENDING)
    
    # Payment details (could be bank account, crypto wallet, etc.)
    payment_method = Column(String, nullable=True)
    payment_details = Column(String, nullable=True)
    
    # Admin notes
    admin_notes = Column(String, nullable=True)
    
    # Timestamps
    requested_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="withdrawals")