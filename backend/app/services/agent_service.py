"""
Agent service - business logic for agent operations.

Think of this as the Agent Management Department:
- Creates and manages players
- Calculates commissions
- Handles withdrawal requests
- Generates reports
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import List, Dict

from ..models.agent import Agent
from ..models.player import Player, PlayerStatus
from ..models.commission import Commission, CommissionType
from ..models.withdrawal import Withdrawal, WithdrawalStatus


class AgentService:
    """Service for agent operations"""
    
    @staticmethod
    def get_dashboard_stats(agent: Agent, db: Session) -> dict:
        """
        Get dashboard statistics for an agent.
        
        Story: Agent logs in and sees their dashboard
        We show: total players, earnings, pending withdrawals, recent activity
        
        Args:
            agent: Agent object
            db: Database session
            
        Returns:
            Dictionary with dashboard stats
        """
        # Total players under this agent
        total_players = db.query(func.count(Player.id)).filter(
            Player.agent_id == agent.id
        ).scalar()
        
        # Active players
        active_players = db.query(func.count(Player.id)).filter(
            and_(
                Player.agent_id == agent.id,
                Player.status == PlayerStatus.ACTIVE
            )
        ).scalar()
        
        # Last 7 days earnings
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_earnings = db.query(
            func.date(Commission.created_at).label('date'),
            func.sum(Commission.amount).label('total')
        ).filter(
            and_(
                Commission.agent_id == agent.id,
                Commission.created_at >= seven_days_ago
            )
        ).group_by(
            func.date(Commission.created_at)
        ).all()
        
        # Format earnings data for chart
        earnings_chart = [
            {"date": str(item.date), "amount": float(item.total)}
            for item in recent_earnings
        ]
        
        # Pending withdrawals
        pending_withdrawals = db.query(Withdrawal).filter(
            and_(
                Withdrawal.user_id == agent.user_id,
                Withdrawal.status == WithdrawalStatus.PENDING
            )
        ).count()
        
        return {
            "total_players": total_players,
            "active_players": active_players,
            "total_earnings": float(agent.total_earnings),
            "withdrawable_balance": float(agent.withdrawable_balance),
            "commission_rate": float(agent.commission_rate * 100),  # Show as percentage
            "pending_withdrawals": pending_withdrawals,
            "earnings_chart": earnings_chart
        }
    
    @staticmethod
    def create_player(
        agent: Agent,
        username: str,
        email: str,
        db: Session
    ) -> Player:
        """
        Create a new player under this agent.
        
        Story: Agent registers a new customer
        We create their player account and link it to the agent
        
        Args:
            agent: Agent creating the player
            username: Player's username
            email: Player's email
            db: Database session
            
        Returns:
            Created Player object
        """
        # Check if username exists
        existing_player = db.query(Player).filter(
            Player.username == username
        ).first()
        if existing_player:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Check if email exists
        existing_email = db.query(Player).filter(
            Player.email == email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create player
        player = Player(
            agent_id=agent.id,
            username=username,
            email=email,
            status=PlayerStatus.ACTIVE
        )
        
        db.add(player)
        db.commit()
        db.refresh(player)
        
        return player
    
    @staticmethod
    def get_players(
        agent: Agent,
        db: Session,
        skip: int = 0,
        limit: int = 10
    ) -> List[Player]:
        """
        Get list of players under this agent.
        
        Args:
            agent: Agent object
            db: Database session
            skip: Number of records to skip (pagination)
            limit: Max records to return
            
        Returns:
            List of Player objects
        """
        players = db.query(Player).filter(
            Player.agent_id == agent.id
        ).offset(skip).limit(limit).all()
        
        return players
    
    @staticmethod
    def toggle_player_status(
        agent: Agent,
        player_id: int,
        db: Session
    ) -> Player:
        """
        Block or unblock a player.
        
        Story: Agent wants to block a problematic customer
        We check if player belongs to this agent, then toggle status
        
        Args:
            agent: Agent performing the action
            player_id: ID of player to toggle
            db: Database session
            
        Returns:
            Updated Player object
        """
        player = db.query(Player).filter(
            and_(
                Player.id == player_id,
                Player.agent_id == agent.id
            )
        ).first()
        
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found or doesn't belong to you"
            )
        
        # Toggle status
        if player.status == PlayerStatus.ACTIVE:
            player.status = PlayerStatus.BLOCKED
        else:
            player.status = PlayerStatus.ACTIVE
        
        db.commit()
        db.refresh(player)
        
        return player
    
    @staticmethod
    def request_withdrawal(
        agent: Agent,
        amount: float,
        payment_method: str,
        payment_details: str,
        db: Session
    ) -> Withdrawal:
        """
        Request a withdrawal.
        
        Story: Agent wants to withdraw their earnings
        We check if they have enough balance, then create withdrawal request
        
        Args:
            agent: Agent requesting withdrawal
            amount: Amount to withdraw
            payment_method: e.g., "bank_transfer", "crypto"
            payment_details: Account details
            db: Database session
            
        Returns:
            Created Withdrawal object
        """
        # Check if agent has enough balance
        if amount > agent.withdrawable_balance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: ${agent.withdrawable_balance:.2f}"
            )
        
        # Minimum withdrawal check
        if amount < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Minimum withdrawal amount is $50"
            )
        
        # Create withdrawal request
        withdrawal = Withdrawal(
            user_id=agent.user_id,
            amount=amount,
            payment_method=payment_method,
            payment_details=payment_details,
            status=WithdrawalStatus.PENDING
        )
        
        # Deduct from withdrawable balance (lock it)
        agent.withdrawable_balance -= amount
        
        db.add(withdrawal)
        db.commit()
        db.refresh(withdrawal)
        
        return withdrawal
    
    @staticmethod
    def get_commissions(
        agent: Agent,
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> List[Commission]:
        """
        Get commission history for agent.
        
        Args:
            agent: Agent object
            db: Database session
            skip: Pagination offset
            limit: Max records
            
        Returns:
            List of Commission objects
        """
        commissions = db.query(Commission).filter(
            Commission.agent_id == agent.id
        ).order_by(
            Commission.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        return commissions
    
    @staticmethod
    def get_withdrawals(
        agent: Agent,
        db: Session
    ) -> List[Withdrawal]:
        """
        Get withdrawal history for agent.
        
        Args:
            agent: Agent object
            db: Database session
            
        Returns:
            List of Withdrawal objects
        """
        withdrawals = db.query(Withdrawal).filter(
            Withdrawal.user_id == agent.user_id
        ).order_by(
            Withdrawal.requested_at.desc()
        ).all()
        
        return withdrawals