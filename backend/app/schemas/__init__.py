"""
Pydantic schemas for request/response validation.
These are the "forms" that validate incoming/outgoing data.
"""

from .user import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    TokenData
)

from .agent import (
    AgentCreate,
    AgentResponse,
    AgentDashboard,
    PlayerCreate,
    PlayerResponse,
    CommissionResponse,
    WithdrawalCreate,
    WithdrawalResponse
)

from .affiliate import (
    AffiliateCreate,
    AffiliateResponse,
    AffiliateDashboard,
    ClickResponse,
    ReferralLinkResponse
)

__all__ = [
    # User schemas
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenData",
    
    # Agent schemas
    "AgentCreate",
    "AgentResponse",
    "AgentDashboard",
    "PlayerCreate",
    "PlayerResponse",
    "CommissionResponse",
    "WithdrawalCreate",
    "WithdrawalResponse",
    
    # Affiliate schemas
    "AffiliateCreate",
    "AffiliateResponse",
    "AffiliateDashboard",
    "ClickResponse",
    "ReferralLinkResponse",
]