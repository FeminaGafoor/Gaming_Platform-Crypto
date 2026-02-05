from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..utils.dependencies import get_current_agent
from ..services.agent_service import AgentService
from ..schemas.agent import *

# Remove prefix - it's added in main.py
router = APIRouter()

@router.get("/dashboard")
async def get_dashboard(
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Get agent dashboard stats"""
    service = AgentService(db)
    return service.get_dashboard_stats(agent.id)

@router.get("/players")
async def get_players(
    skip: int = 0,
    limit: int = 100,
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Get list of players"""
    service = AgentService(db)
    return service.get_players(agent.id, skip, limit)

@router.post("/players")
async def create_player(
    player_data: dict,
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Create a new player"""
    service = AgentService(db)
    return service.create_player(agent.id, player_data)

@router.put("/players/{player_id}/toggle-status")
async def toggle_player_status(
    player_id: int,
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Toggle player status (active/blocked)"""
    service = AgentService(db)
    return service.toggle_player_status(player_id, agent.id)

@router.get("/commissions")
async def get_commissions(
    skip: int = 0,
    limit: int = 100,
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Get commission history"""
    service = AgentService(db)
    return service.get_commissions(agent.id, skip, limit)

@router.get("/withdrawals")
async def get_withdrawals(
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Get withdrawal history"""
    service = AgentService(db)
    return service.get_withdrawals(agent.user_id)

@router.post("/withdrawals")
async def request_withdrawal(
    withdrawal_data: dict,
    agent = Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    """Request a withdrawal"""
    service = AgentService(db)
    return service.request_withdrawal(agent.user_id, agent.id, withdrawal_data)
