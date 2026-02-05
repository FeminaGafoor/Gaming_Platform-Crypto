from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models.agent import Agent
from ..models.player import Player
from ..models.commission import Commission
from ..models.withdrawal import Withdrawal


class AgentService:
    """Handle agent operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard_stats(self, agent_id: int) -> dict:
        """Get dashboard statistics for agent"""
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        if not agent:
            return {}
        
        total_players = self.db.query(Player).filter(Player.agent_id == agent_id).count()
        active_players = self.db.query(Player).filter(
            Player.agent_id == agent_id,
            Player.status == 'ACTIVE'
        ).count()
        
        total_earnings = agent.total_earnings or 0.0
        withdrawable_balance = agent.withdrawable_balance or 0.0
        
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_commissions = self.db.query(Commission).filter(
            Commission.agent_id == agent_id,
            Commission.created_at >= seven_days_ago
        ).all()
        
        earnings_chart = {}
        for comm in recent_commissions:
            date_key = comm.created_at.strftime('%Y-%m-%d')
            earnings_chart[date_key] = earnings_chart.get(date_key, 0) + comm.amount
        
        chart_data = [
            {"date": date, "amount": amount}
            for date, amount in sorted(earnings_chart.items())
        ]
        
        return {
            "total_players": total_players,
            "active_players": active_players,
            "total_earnings": total_earnings,
            "withdrawable_balance": withdrawable_balance,
            "commission_rate": agent.commission_rate * 100,
            "earnings_chart": chart_data
        }
    
    def get_players(self, agent_id: int, skip: int = 0, limit: int = 100):
        """Get list of players for agent"""
        players = self.db.query(Player).filter(
            Player.agent_id == agent_id
        ).offset(skip).limit(limit).all()
        return players
    
    def create_player(self, agent_id: int, player_data: dict):
        """Create a new player"""
        player = Player(
            agent_id=agent_id,
            username=player_data.get('username'),
            email=player_data.get('email'),
            status='ACTIVE',
            total_deposits=0.0,
            total_losses=0.0,
            created_at=datetime.utcnow()
        )
        self.db.add(player)
        self.db.commit()
        self.db.refresh(player)
        return player
    
    def toggle_player_status(self, player_id: int, agent_id: int):
        """Toggle player status (active/blocked)"""
        player = self.db.query(Player).filter(
            Player.id == player_id,
            Player.agent_id == agent_id
        ).first()
        
        if not player:
            raise ValueError("Player not found")
        
        player.status = 'BLOCKED' if player.status == 'ACTIVE' else 'ACTIVE'
        self.db.commit()
        return player
    
    def get_commissions(self, agent_id: int, skip: int = 0, limit: int = 100):
        """Get commission history"""
        commissions = self.db.query(Commission).filter(
            Commission.agent_id == agent_id
        ).order_by(Commission.created_at.desc()).offset(skip).limit(limit).all()
        return commissions
    
    def get_withdrawals(self, user_id: int):
        """Get withdrawal history"""
        # FIXED: Use requested_at instead of created_at
        withdrawals = self.db.query(Withdrawal).filter(
            Withdrawal.user_id == user_id
        ).order_by(Withdrawal.requested_at.desc()).all()
        return withdrawals
    
    def request_withdrawal(self, user_id: int, agent_id: int, withdrawal_data: dict):
        """Request a withdrawal"""
        agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
        
        amount = float(withdrawal_data.get('amount', 0))
        if amount > agent.withdrawable_balance:
            raise ValueError("Insufficient balance")
        
        withdrawal = Withdrawal(
            user_id=user_id,
            agent_id=agent_id,
            amount=amount,
            payment_method=withdrawal_data.get('payment_method'),
            payment_details=withdrawal_data.get('payment_details'),
            status='PENDING',
            requested_at=datetime.utcnow()
        )
        
        self.db.add(withdrawal)
        self.db.commit()
        return withdrawal
