from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models.affiliate import Affiliate
from ..models.click import Click
from ..models.commission import Commission
from ..models.withdrawal import Withdrawal


class AffiliateService:
    """Handle affiliate operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_dashboard_stats(self, affiliate_id: int) -> dict:
        """Get dashboard statistics for affiliate"""
        affiliate = self.db.query(Affiliate).filter(Affiliate.id == affiliate_id).first()
        if not affiliate:
            return {}
        
        total_clicks = affiliate.total_clicks or 0
        total_registrations = affiliate.total_registrations or 0
        total_conversions = affiliate.total_conversions or 0
        total_earnings = affiliate.total_earnings or 0.0
        withdrawable_balance = affiliate.withdrawable_balance or 0.0
        
        conversion_rate = (total_conversions / total_registrations * 100) if total_registrations > 0 else 0
        
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        clicks_chart = []
        earnings_chart = []
        
        referral_url = f"https://gaming-platform.com/signup?ref={affiliate.referral_code}"
        
        return {
            "total_clicks": total_clicks,
            "total_registrations": total_registrations,
            "total_conversions": total_conversions,
            "total_earnings": total_earnings,
            "withdrawable_balance": withdrawable_balance,
            "conversion_rate": round(conversion_rate, 2),
            "cpa_amount": affiliate.cpa_amount,
            "clicks_chart": clicks_chart,
            "earnings_chart": earnings_chart,
            "referral_url": referral_url
        }
    
    def get_referral_link(self, affiliate_id: int):
        """Get referral link and marketing materials"""
        affiliate = self.db.query(Affiliate).filter(Affiliate.id == affiliate_id).first()
        if not affiliate:
            return {}
        
        return {
            "referral_code": affiliate.referral_code,
            "referral_url": f"https://gaming-platform.com/signup?ref={affiliate.referral_code}",
            "short_url": f"https://gp.co/{affiliate.referral_code}",
            "qr_code_url": f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://gaming-platform.com/signup?ref={affiliate.referral_code}",
            "cpa_amount": affiliate.cpa_amount,
            "banner_images": []
        }
    
    def get_clicks(self, affiliate_id: int, skip: int = 0, limit: int = 100):
        """Get click history"""
        clicks = self.db.query(Click).filter(
            Click.affiliate_id == affiliate_id
        ).order_by(Click.created_at.desc()).offset(skip).limit(limit).all()
        return clicks
    
    def get_conversions(self, affiliate_id: int, skip: int = 0, limit: int = 100):
        """Get converted players"""
        return []
    
    def get_commissions(self, affiliate_id: int, skip: int = 0, limit: int = 100):
        """Get commission history"""
        commissions = self.db.query(Commission).filter(
            Commission.affiliate_id == affiliate_id
        ).order_by(Commission.created_at.desc()).offset(skip).limit(limit).all()
        return commissions
    
    def get_withdrawals(self, user_id: int):
        """Get withdrawal history"""
        # FIXED: Use requested_at instead of created_at
        withdrawals = self.db.query(Withdrawal).filter(
            Withdrawal.user_id == user_id
        ).order_by(Withdrawal.requested_at.desc()).all()
        return withdrawals
    
    def request_withdrawal(self, user_id: int, affiliate_id: int, withdrawal_data: dict):
        """Request a withdrawal"""
        affiliate = self.db.query(Affiliate).filter(Affiliate.id == affiliate_id).first()
        
        amount = float(withdrawal_data.get('amount', 0))
        if amount > affiliate.withdrawable_balance:
            raise ValueError("Insufficient balance")
        
        withdrawal = Withdrawal(
            user_id=user_id,
            affiliate_id=affiliate_id,
            amount=amount,
            payment_method=withdrawal_data.get('payment_method'),
            payment_details=withdrawal_data.get('payment_details'),
            status='PENDING',
            requested_at=datetime.utcnow()
        )
        
        self.db.add(withdrawal)
        self.db.commit()
        return withdrawal
    
    def get_marketing_assets(self, affiliate_id: int):
        """Get marketing assets"""
        return {
            "banners": [],
            "promotional_text": [
                {
                    "title": "Welcome Bonus",
                    "text": "Join the #1 gaming platform and get $100 bonus!"
                }
            ],
            "social_templates": {
                "twitter": "Check out this amazing gaming platform! 🎮",
                "facebook": "I've been using this gaming platform and loving it!"
            }
        }
    
    def get_performance_report(self, affiliate_id: int, report_data: dict):
        """Get performance report for date range"""
        return {"message": "Report generation not yet implemented"}
