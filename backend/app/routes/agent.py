"""
Agent routes - all agent panel endpoints.

Think of this as the Agent Service Desk:
- Dashboard stats
- Player management
- Commission tracking
- Withdrawal requests
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional

from ..database import get_db
from ..models.agent import Agent
from ..models.player import Player, PlayerStatus
from ..models.commission import Commission
from ..models.withdrawal import Withdrawal, WithdrawalStatus
from ..services.agent_service import AgentService
from ..utils.dependencies import get_current_agent

router = APIRouter(prefix="/api/agent", tags=["Agent"])


# Pydantic Models
class CreatePlayerRequest(BaseModel):
    """Create player request"""
    username: str
    email: EmailStr
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "player123",
                "email": "player@example.com"
            }
        }


class WithdrawalRequest(BaseModel):
    """Withdrawal request"""
    amount: float
    payment_method: str
    payment_details: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 500.00,
                "payment_method": "bank_transfer",
                "payment_details": "Account: 1234567890, Bank: ABC Bank"
            }
        }


class PlayerResponse(BaseModel):
    """Player response model"""
    id: int
    username: str
    email: str
    status: str
    total_deposits: float
    total_losses: float
    created_at: str
    
    class Config:
        from_attributes = True


class CommissionResponse(BaseModel):
    """Commission response model"""
    id: int
    amount: float
    commission_type: str
    description: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True


class WithdrawalResponse(BaseModel):
    """Withdrawal response model"""
    id: int
    amount: float
    status: str
    payment_method: Optional[str]
    requested_at: str
    processed_at: Optional[str]
    
    class Config:
        from_attributes = True


@router.get("/dashboard")
def get_dashboard(
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Get agent dashboard statistics.
    
    Story: Agent logs in and sees their control panel
    Shows: players, earnings, charts, pending withdrawals
    
    Requires authentication token in header:
    Authorization: Bearer <your_token>
    """
    stats = AgentService.get_dashboard_stats(agent, db)
    return stats


@router.post("/players", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
def create_player(
    request: CreatePlayerRequest,
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Create a new player under this agent.
    
    Story: Agent registers a new customer
    Customer gets created and linked to this agent
    
    - **username**: Unique username for the player
    - **email**: Player's email address
    """
    player = AgentService.create_player(
        agent=agent,
        username=request.username,
        email=request.email,
        db=db
    )
    
    return PlayerResponse(
        id=player.id,
        username=player.username,
        email=player.email,
        status=player.status.value,
        total_deposits=player.total_deposits,
        total_losses=player.total_losses,
        created_at=player.created_at.isoformat()
    )


@router.get("/players", response_model=List[PlayerResponse])
def get_players(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Get list of players under this agent.
    
    Story: Agent views their customer list
    Supports pagination for large lists
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum records to return (1-100)
    """
    players = AgentService.get_players(agent, db, skip, limit)
    
    return [
        PlayerResponse(
            id=p.id,
            username=p.username,
            email=p.email,
            status=p.status.value,
            total_deposits=p.total_deposits,
            total_losses=p.total_losses,
            created_at=p.created_at.isoformat()
        )
        for p in players
    ]


@router.put("/players/{player_id}/toggle-status", response_model=PlayerResponse)
def toggle_player_status(
    player_id: int,
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Block or unblock a player.
    
    Story: Agent needs to block a problematic customer
    Toggles between ACTIVE and BLOCKED status
    
    - **player_id**: ID of the player to toggle
    """
    player = AgentService.toggle_player_status(agent, player_id, db)
    
    return PlayerResponse(
        id=player.id,
        username=player.username,
        email=player.email,
        status=player.status.value,
        total_deposits=player.total_deposits,
        total_losses=player.total_losses,
        created_at=player.created_at.isoformat()
    )


@router.get("/commissions", response_model=List[CommissionResponse])
def get_commissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Get commission history.
    
    Story: Agent wants to see their earning records
    Shows all commissions earned over time
    
    - **skip**: Pagination offset
    - **limit**: Max records to return
    """
    commissions = AgentService.get_commissions(agent, db, skip, limit)
    
    return [
        CommissionResponse(
            id=c.id,
            amount=c.amount,
            commission_type=c.commission_type.value,
            description=c.description,
            created_at=c.created_at.isoformat()
        )
        for c in commissions
    ]


@router.post("/withdrawals", response_model=WithdrawalResponse, status_code=status.HTTP_201_CREATED)
def request_withdrawal(
    request: WithdrawalRequest,
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Request a withdrawal.
    
    Story: Agent wants to cash out their earnings
    Creates withdrawal request for admin approval
    
    - **amount**: Amount to withdraw (min $50)
    - **payment_method**: "bank_transfer", "crypto", etc.
    - **payment_details**: Account information
    """
    withdrawal = AgentService.request_withdrawal(
        agent=agent,
        amount=request.amount,
        payment_method=request.payment_method,
        payment_details=request.payment_details,
        db=db
    )
    
    return WithdrawalResponse(
        id=withdrawal.id,
        amount=withdrawal.amount,
        status=withdrawal.status.value,
        payment_method=withdrawal.payment_method,
        requested_at=withdrawal.requested_at.isoformat(),
        processed_at=withdrawal.processed_at.isoformat() if withdrawal.processed_at else None
    )


@router.get("/withdrawals", response_model=List[WithdrawalResponse])
def get_withdrawals(
    agent: Agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """
    Get withdrawal history.
    
    Story: Agent checks status of their payout requests
    Shows all past and pending withdrawals
    """
    withdrawals = AgentService.get_withdrawals(agent, db)
    
    return [
        WithdrawalResponse(
            id=w.id,
            amount=w.amount,
            status=w.status.value,
            payment_method=w.payment_method,
            requested_at=w.requested_at.isoformat(),
            processed_at=w.processed_at.isoformat() if w.processed_at else None
        )
        for w in withdrawals
    ]