from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models.withdrawal import Withdrawal
from ..models.agent import Agent
from ..models.affiliate import Affiliate
from ..models.user import User
from ..utils.dependencies import get_current_admin

router = APIRouter()

@router.get("/withdrawals")
def list_withdrawals(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get all withdrawals with user details"""
    withdrawals = db.query(Withdrawal).order_by(Withdrawal.requested_at.desc()).all()

    # Enrich with user details
    result = []
    for w in withdrawals:
        user = db.query(User).filter(User.id == w.user_id).first()
        withdrawal_dict = {
            "id": w.id,
            "user_id": w.user_id,
            "user_email": user.email if user else "Unknown",
            "user_role": user.role.value if user else "Unknown",
            "amount": w.amount,
            "status": w.status,
            "payment_method": w.payment_method,
            "payment_details": w.payment_details,
            "requested_at": w.requested_at.isoformat() if w.requested_at else None,
            "processed_at": w.processed_at.isoformat() if w.processed_at else None,
            "admin_notes": w.admin_notes
        }
        result.append(withdrawal_dict)

    return result

@router.put("/withdrawals/{withdrawal_id}/approve")
def approve_withdrawal(
    withdrawal_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Approve withdrawal and deduct balance"""
    withdrawal = db.query(Withdrawal).filter(Withdrawal.id == withdrawal_id).first()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    if withdrawal.status != "PENDING":
        raise HTTPException(status_code=400, detail="Withdrawal already processed")

    # Deduct balance from agent or affiliate
    if withdrawal.agent_id:
        agent = db.query(Agent).filter(Agent.id == withdrawal.agent_id).first()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")

        if agent.withdrawable_balance < withdrawal.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        agent.withdrawable_balance -= withdrawal.amount

    elif withdrawal.affiliate_id:
        affiliate = db.query(Affiliate).filter(Affiliate.id == withdrawal.affiliate_id).first()
        if not affiliate:
            raise HTTPException(status_code=404, detail="Affiliate not found")

        if affiliate.withdrawable_balance < withdrawal.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        affiliate.withdrawable_balance -= withdrawal.amount

    withdrawal.status = "APPROVED"
    withdrawal.processed_at = datetime.utcnow()
    db.commit()
    db.refresh(withdrawal)
    return withdrawal

@router.put("/withdrawals/{withdrawal_id}/reject")
def reject_withdrawal(
    withdrawal_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Reject withdrawal (no balance change needed as balance wasn't deducted on request)"""
    withdrawal = db.query(Withdrawal).filter(Withdrawal.id == withdrawal_id).first()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    if withdrawal.status != "PENDING":
        raise HTTPException(status_code=400, detail="Withdrawal already processed")

    withdrawal.status = "REJECTED"
    withdrawal.processed_at = datetime.utcnow()
    db.commit()
    db.refresh(withdrawal)
    return withdrawal
