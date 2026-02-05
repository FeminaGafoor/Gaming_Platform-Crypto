from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models.withdrawal import Withdrawal

router = APIRouter()

@router.get("/withdrawals")
def list_withdrawals(db: Session = Depends(get_db)):
    return db.query(Withdrawal).order_by(Withdrawal.requested_at.desc()).all()

@router.put("/withdrawals/{withdrawal_id}/approve")
def approve_withdrawal(withdrawal_id: int, db: Session = Depends(get_db)):
    withdrawal = db.query(Withdrawal).filter(Withdrawal.id == withdrawal_id).first()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    withdrawal.status = "APPROVED"
    withdrawal.processed_at = datetime.utcnow()
    db.commit()
    db.refresh(withdrawal)
    return withdrawal

@router.put("/withdrawals/{withdrawal_id}/reject")
def reject_withdrawal(withdrawal_id: int, db: Session = Depends(get_db)):
    withdrawal = db.query(Withdrawal).filter(Withdrawal.id == withdrawal_id).first()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    withdrawal.status = "REJECTED"
    withdrawal.processed_at = datetime.utcnow()
    db.commit()
    db.refresh(withdrawal)
    return withdrawal
