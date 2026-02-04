from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from ..models.player import PlayerStatus

class AgentBase(BaseModel):
    """Base agent information"""
    pass

class AgentCreate(BaseModel):
    """
    Creating a new agent account.
    Note: User creation is handled separately in auth.
    This just adds agent-specific info.
    """
    commission_rate: float = Field(default=0.10, ge=0, le=1, description="Commission rate (0.0 to 1.0)")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "commission_rate": 0.15
            }
        }
    )

class AgentResponse(AgentBase):
    """
    Agent profile information.
    What an agent sees about themselves.
    """
    id: int
    user_id: int
    commission_rate: float
    total_earnings: float
    withdrawable_balance: float
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AgentDashboard(BaseModel):
    """
    Dashboard statistics for agent.
    
    Think of this as the "control panel" view:
    - How many players do I manage?
    - How much have I earned?
    - What's my commission this week?
    """
    total_players: int
    active_players: int
    total_earnings: float
    pending_commissions: float
    withdrawable_balance: float
    last_7_days_earnings: List[dict]  # [{date: "2024-01-01", amount: 150.00}, ...]
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_players": 45,
                "active_players": 32,
                "total_earnings": 15420.50,
                "pending_commissions": 320.00,
                "withdrawable_balance": 8500.00,
                "last_7_days_earnings": [
                    {"date": "2024-01-15", "amount": 250.00},
                    {"date": "2024-01-16", "amount": 180.00}
                ]
            }
        }
    )

# ============ PLAYER SCHEMAS ============

class PlayerCreate(BaseModel):
    """
    Form for agent to register a new player.
    
    Like filling out a membership form:
    - Username
    - Email
    - Initial status
    """
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "john_player",
                "email": "john@example.com"
            }
        }
    )

class PlayerResponse(BaseModel):
    """
    Player information visible to agent.
    
    What the agent sees about their players.
    """
    id: int
    username: str
    email: str
    status: PlayerStatus
    total_deposits: float
    total_bets: float
    total_wins: float
    total_losses: float
    created_at: datetime
    last_login: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class PlayerUpdate(BaseModel):
    """
    Update player status (block/unblock).
    """
    status: PlayerStatus

# ============ COMMISSION SCHEMAS ============

class CommissionResponse(BaseModel):
    """
    Commission record details.
    
    Like a payslip entry:
    - Date earned
    - Amount
    - Which player generated it
    """
    id: int
    amount: float
    commission_type: str
    description: Optional[str] = None
    created_at: datetime
    player_id: int
    
    model_config = ConfigDict(from_attributes=True)

# ============ WITHDRAWAL SCHEMAS ============

class WithdrawalCreate(BaseModel):
    """
    Request a withdrawal.
    
    Like filling out a salary advance form:
    - How much?
    - Where to send? (bank/crypto)
    """
    amount: float = Field(..., gt=0, description="Amount must be greater than 0")
    payment_method: str = Field(..., description="e.g., 'bank_transfer', 'crypto', 'paypal'")
    payment_details: str = Field(..., description="Bank account, wallet address, etc.")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "amount": 500.00,
                "payment_method": "bank_transfer",
                "payment_details": "Account: 1234567890, IBAN: AE070123456789012345678"
            }
        }
    )

class WithdrawalResponse(BaseModel):
    """
    Withdrawal request status.
    """
    id: int
    amount: float
    status: str  # pending, approved, rejected, processed
    payment_method: str
    payment_details: str
    admin_notes: Optional[str] = None
    requested_at: datetime
    processed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)