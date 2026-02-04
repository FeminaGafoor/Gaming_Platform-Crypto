"""
Affiliate service - business logic for affiliate operations.

Think of this as the Marketing Department:
- Tracks referral links and clicks
- Calculates CPA commissions
- Manages conversions
- Generates marketing reports
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import List, Dict, Optional

from ..models.affiliate import Affiliate
from ..models.player import Player, PlayerStatus
from ..models.click import Click
from ..models.commission import Commission, CommissionType
from ..models.withdrawal import Withdrawal, WithdrawalStatus


class AffiliateService:
    """Service for affiliate operations"""
    
    @staticmethod
    def get_dashboard_stats(affiliate: Affiliate, db: Session) -> dict:
        """
        Get dashboard statistics for an affiliate.
        
        Story: Affiliate logs in and sees their marketing performance
        We show: clicks, conversions, earnings, conversion rates
        
        Args:
            affiliate: Affiliate object
            db: Database session
            
        Returns:
            Dictionary with dashboard stats
        """
        # Total clicks
        total_clicks = db.query(func.count(Click.id)).filter(
            Click.affiliate_id == affiliate.id
        ).scalar()
        
        # Total conversions (players who actually deposited)
        total_conversions = db.query(func.count(Player.id)).filter(
            and_(
                Player.affiliate_id == affiliate.id,
                Player.total_deposits > 0
            )
        ).scalar()
        
        # Calculate conversion rate
        conversion_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
        
        # Last 7 days click trend
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_clicks = db.query(
            func.date(Click.clicked_at).label('date'),
            func.count(Click.id).label('count')
        ).filter(
            and_(
                Click.affiliate_id == affiliate.id,
                Click.clicked_at >= seven_days_ago
            )
        ).group_by(
            func.date(Click.clicked_at)
        ).all()
        
        # Format clicks data for chart
        clicks_chart = [
            {"date": str(item.date), "clicks": item.count}
            for item in recent_clicks
        ]
        
        # Last 7 days earnings
        recent_earnings = db.query(
            func.date(Commission.created_at).label('date'),
            func.sum(Commission.amount).label('total')
        ).filter(
            and_(
                Commission.affiliate_id == affiliate.id,
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
                Withdrawal.user_id == affiliate.user_id,
                Withdrawal.status == WithdrawalStatus.PENDING
            )
        ).count()
        
        return {
            "total_clicks": total_clicks or 0,
            "total_registrations": affiliate.total_registrations,
            "total_conversions": total_conversions or 0,
            "conversion_rate": round(conversion_rate, 2),
            "total_earnings": float(affiliate.total_earnings),
            "withdrawable_balance": float(affiliate.withdrawable_balance),
            "commission_type": affiliate.commission_type,
            "cpa_amount": float(affiliate.cpa_amount),
            "pending_withdrawals": pending_withdrawals,
            "clicks_chart": clicks_chart,
            "earnings_chart": earnings_chart,
            "referral_code": affiliate.referral_code,
            "referral_url": f"https://gaming-platform.com?ref={affiliate.referral_code}"
        }
    
    @staticmethod
    def track_click(
        referral_code: str,
        ip_address: Optional[str],
        user_agent: Optional[str],
        referrer: Optional[str],
        db: Session
    ) -> dict:
        """
        Track a click on affiliate's referral link.
        
        Story: Someone clicks an affiliate's link
        We record who clicked, when, and from where
        This helps affiliates see which marketing channels work
        
        Args:
            referral_code: Affiliate's unique code
            ip_address: Visitor's IP
            user_agent: Browser info
            referrer: Where they came from
            db: Database session
            
        Returns:
            Dictionary with tracking info
        """
        # Find affiliate by referral code
        affiliate = db.query(Affiliate).filter(
            Affiliate.referral_code == referral_code
        ).first()
        
        if not affiliate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid referral code"
            )
        
        # Create click record
        click = Click(
            affiliate_id=affiliate.id,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer
        )
        
        # Update affiliate stats
        affiliate.total_clicks += 1
        
        db.add(click)
        db.commit()
        db.refresh(click)
        
        return {
            "message": "Click tracked successfully",
            "click_id": click.id,
            "affiliate_code": referral_code
        }
    
    @staticmethod
    def get_referral_link(affiliate: Affiliate) -> dict:
        """
        Get affiliate's referral link and marketing materials.
        
        Story: Affiliate wants their promotional link
        We generate it with their unique code
        
        Args:
            affiliate: Affiliate object
            
        Returns:
            Dictionary with referral link and code
        """
        base_url = "https://gaming-platform.com"
        referral_url = f"{base_url}?ref={affiliate.referral_code}"
        
        return {
            "referral_code": affiliate.referral_code,
            "referral_url": referral_url,
            "short_url": f"{base_url}/r/{affiliate.referral_code}",
            "qr_code_url": f"{base_url}/api/qr/{affiliate.referral_code}",
            "banner_images": [
                f"{base_url}/assets/banners/728x90.png",
                f"{base_url}/assets/banners/300x250.png",
                f"{base_url}/assets/banners/160x600.png"
            ]
        }
    
    @staticmethod
    def get_clicks(
        affiliate: Affiliate,
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> List[Click]:
        """
        Get click history for affiliate.
        
        Args:
            affiliate: Affiliate object
            db: Database session
            skip: Pagination offset
            limit: Max records
            
        Returns:
            List of Click objects
        """
        clicks = db.query(Click).filter(
            Click.affiliate_id == affiliate.id
        ).order_by(
            Click.clicked_at.desc()
        ).offset(skip).limit(limit).all()
        
        return clicks
    
    @staticmethod
    def get_conversions(
        affiliate: Affiliate,
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> List[Player]:
        """
        Get list of converted players (who deposited).
        
        Story: Affiliate wants to see which referrals actually paid off
        We show players who came through their link AND made deposits
        
        Args:
            affiliate: Affiliate object
            db: Database session
            skip: Pagination offset
            limit: Max records
            
        Returns:
            List of Player objects who deposited
        """
        conversions = db.query(Player).filter(
            and_(
                Player.affiliate_id == affiliate.id,
                Player.total_deposits > 0
            )
        ).order_by(
            Player.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        return conversions
    
    @staticmethod
    def get_commissions(
        affiliate: Affiliate,
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> List[Commission]:
        """
        Get commission history for affiliate.
        
        Args:
            affiliate: Affiliate object
            db: Database session
            skip: Pagination offset
            limit: Max records
            
        Returns:
            List of Commission objects
        """
        commissions = db.query(Commission).filter(
            Commission.affiliate_id == affiliate.id
        ).order_by(
            Commission.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        return commissions
    
    @staticmethod
    def request_withdrawal(
        affiliate: Affiliate,
        amount: float,
        payment_method: str,
        payment_details: str,
        db: Session
    ) -> Withdrawal:
        """
        Request a withdrawal.
        
        Story: Affiliate wants to cash out their earnings
        We check balance and create withdrawal request
        
        Args:
            affiliate: Affiliate requesting withdrawal
            amount: Amount to withdraw
            payment_method: e.g., "bank_transfer", "paypal", "crypto"
            payment_details: Account details
            db: Database session
            
        Returns:
            Created Withdrawal object
        """
        # Check if affiliate has enough balance
        if amount > affiliate.withdrawable_balance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: ${affiliate.withdrawable_balance:.2f}"
            )
        
        # Minimum withdrawal check
        if amount < 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Minimum withdrawal amount is $100"
            )
        
        # Create withdrawal request
        withdrawal = Withdrawal(
            user_id=affiliate.user_id,
            amount=amount,
            payment_method=payment_method,
            payment_details=payment_details,
            status=WithdrawalStatus.PENDING
        )
        
        # Deduct from withdrawable balance (lock it)
        affiliate.withdrawable_balance -= amount
        
        db.add(withdrawal)
        db.commit()
        db.refresh(withdrawal)
        
        return withdrawal
    
    @staticmethod
    def get_withdrawals(
        affiliate: Affiliate,
        db: Session
    ) -> List[Withdrawal]:
        """
        Get withdrawal history for affiliate.
        
        Args:
            affiliate: Affiliate object
            db: Database session
            
        Returns:
            List of Withdrawal objects
        """
        withdrawals = db.query(Withdrawal).filter(
            Withdrawal.user_id == affiliate.user_id
        ).order_by(
            Withdrawal.requested_at.desc()
        ).all()
        
        return withdrawals
    
    @staticmethod
    def get_performance_report(
        affiliate: Affiliate,
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> dict:
        """
        Generate performance report for a date range.
        
        Story: Affiliate wants to see their monthly/weekly performance
        We aggregate all stats for that period
        
        Args:
            affiliate: Affiliate object
            db: Database session
            start_date: Report start date (default: 30 days ago)
            end_date: Report end date (default: today)
            
        Returns:
            Dictionary with performance metrics
        """
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        if not end_date:
            end_date = datetime.utcnow()
        
        # Clicks in period
        clicks = db.query(func.count(Click.id)).filter(
            and_(
                Click.affiliate_id == affiliate.id,
                Click.clicked_at >= start_date,
                Click.clicked_at <= end_date
            )
        ).scalar()
        
        # Conversions in period
        conversions = db.query(func.count(Player.id)).filter(
            and_(
                Player.affiliate_id == affiliate.id,
                Player.created_at >= start_date,
                Player.created_at <= end_date,
                Player.total_deposits > 0
            )
        ).scalar()
        
        # Earnings in period
        earnings = db.query(func.sum(Commission.amount)).filter(
            and_(
                Commission.affiliate_id == affiliate.id,
                Commission.created_at >= start_date,
                Commission.created_at <= end_date
            )
        ).scalar() or 0
        
        # Calculate metrics
        conversion_rate = (conversions / clicks * 100) if clicks > 0 else 0
        epc = (earnings / clicks) if clicks > 0 else 0  # Earnings Per Click
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "metrics": {
                "total_clicks": clicks or 0,
                "total_conversions": conversions or 0,
                "conversion_rate": round(conversion_rate, 2),
                "total_earnings": float(earnings),
                "epc": round(epc, 2),
                "avg_commission": round(earnings / conversions, 2) if conversions > 0 else 0
            }
        }