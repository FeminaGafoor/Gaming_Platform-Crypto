"""
Import all models here so they're registered with SQLAlchemy.
Think of this as the "table of contents" for your database.
"""

from .user import User, UserRole
from .agent import Agent
from .affiliate import Affiliate
from .player import Player, PlayerStatus
from .commission import Commission, CommissionType
from .withdrawal import Withdrawal, WithdrawalStatus
from .click import Click

__all__ = [
    "User",
    "UserRole",
    "Agent",
    "Affiliate",
    "Player",
    "PlayerStatus",
    "Commission",
    "CommissionType",
    "Withdrawal",
    "WithdrawalStatus",
    "Click",
]