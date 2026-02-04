"""
API routes.
"""

from .auth import router as auth_router
from .agent import router as agent_router
from .affiliate import router as affiliate_router

__all__ = [
    "auth_router",
    "agent_router",
    "affiliate_router",
]