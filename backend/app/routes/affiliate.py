"""
Affiliate routes - all affiliate panel endpoints.

Think of this as the Affiliate Service Desk:
- Dashboard stats with conversion metrics
- Referral link generation
- Click tracking
- Earnings and payouts
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.affiliate import Affiliate
from ..models.click import Click
from ..models.player import Player
from ..models.commission import Commission
from ..models.withdrawal import Withdrawal
from ..services.affiliate_service import AffiliateService
from ..utils.dependencies import get_current_affiliate

router = APIRouter(prefix="/api/affiliate", tags=["Affiliate"])


# Pydantic Models
class WithdrawalRequest(BaseModel):
    """Withdrawal request"""
    amount: float
    payment_method: str
    payment_details: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 1000.00,
                "payment_method": "paypal",
                "payment_details": "affiliate@paypal.com"
            }
        }


class ClickResponse(BaseModel):
    """Click response model"""
    id: int
    ip_address: Optional[str]
    user_agent: Optional[str]
    referrer: Optional[str]
    converted: bool
    clicked_at: str
    
    class Config:
        from_attributes = True


class ConversionResponse(BaseModel):
    """Conversion response model"""
    id: int
    username: str
    email: str
    total_deposits: float
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


class PerformanceReportRequest(BaseModel):
    """Performance report request"""
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "start_date": "2025-01-01",
                "end_date": "2025-01-31"
            }
        }


@router.get("/dashboard")
def get_dashboard(
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Get affiliate dashboard statistics.
    
    Story: Affiliate logs in and sees their marketing performance
    Shows: clicks, conversions, earnings, conversion rates, charts
    
    Requires authentication token in header:
    Authorization: Bearer <your_token>
    
    Returns:
    - Total clicks and conversions
    - Conversion rate percentage
    - Earnings and balance
    - 7-day trend charts
    - Referral link info
    """
    stats = AffiliateService.get_dashboard_stats(affiliate, db)
    return stats


@router.get("/referral-link")
def get_referral_link(
    affiliate: Affiliate = Depends(get_current_affiliate)
):
    """
    Get affiliate's referral link and marketing materials.
    
    Story: Affiliate needs their promotional link to share
    We generate the full URL with their unique code
    
    Returns:
    - Referral code
    - Full referral URL
    - Short URL
    - QR code URL
    - Banner image URLs
    """
    link_info = AffiliateService.get_referral_link(affiliate)
    return link_info


@router.post("/track-click")
def track_click(
    referral_code: str = Query(..., description="Affiliate's referral code"),
    request: Request = None,
    db: Session = Depends(get_db)
):
    """
    Track a click on an affiliate's referral link.
    
    Story: Someone clicks an affiliate's link
    We record the click for tracking purposes
    
    This endpoint is typically called automatically when someone
    visits the site with ?ref=AFFILIATE_CODE in the URL
    
    - **referral_code**: The affiliate's unique code from the URL
    
    Returns tracking confirmation.
    """
    # Extract IP and user agent from request
    ip_address = request.client.host if request else None
    user_agent = request.headers.get("user-agent") if request else None
    referrer = request.headers.get("referer") if request else None
    
    result = AffiliateService.track_click(
        referral_code=referral_code,
        ip_address=ip_address,
        user_agent=user_agent,
        referrer=referrer,
        db=db
    )
    
    return result


@router.get("/clicks", response_model=List[ClickResponse])
def get_clicks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Get click tracking history.
    
    Story: Affiliate wants to see who clicked their links
    Shows all recorded clicks with details
    
    - **skip**: Pagination offset
    - **limit**: Max records to return (1-100)
    """
    clicks = AffiliateService.get_clicks(affiliate, db, skip, limit)
    
    return [
        ClickResponse(
            id=c.id,
            ip_address=c.ip_address,
            user_agent=c.user_agent,
            referrer=c.referrer,
            converted=c.converted,
            clicked_at=c.clicked_at.isoformat()
        )
        for c in clicks
    ]


@router.get("/conversions", response_model=List[ConversionResponse])
def get_conversions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Get list of converted players (who made deposits).
    
    Story: Affiliate wants to see which referrals actually paid
    Shows players who came through their link AND deposited money
    These are the ones that earn commission!
    
    - **skip**: Pagination offset
    - **limit**: Max records to return (1-100)
    """
    conversions = AffiliateService.get_conversions(affiliate, db, skip, limit)
    
    return [
        ConversionResponse(
            id=p.id,
            username=p.username,
            email=p.email,
            total_deposits=p.total_deposits,
            created_at=p.created_at.isoformat()
        )
        for p in conversions
    ]


@router.get("/commissions", response_model=List[CommissionResponse])
def get_commissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Get commission/earnings history.
    
    Story: Affiliate wants to see their payment records
    Shows all CPA commissions earned over time
    
    - **skip**: Pagination offset
    - **limit**: Max records to return (1-100)
    """
    commissions = AffiliateService.get_commissions(affiliate, db, skip, limit)
    
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
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Request a withdrawal/payout.
    
    Story: Affiliate wants to cash out their earnings
    Creates withdrawal request for admin approval
    
    - **amount**: Amount to withdraw (min $100)
    - **payment_method**: "paypal", "bank_transfer", "crypto", etc.
    - **payment_details**: Payment account information
    
    Balance is locked until request is approved/rejected.
    """
    withdrawal = AffiliateService.request_withdrawal(
        affiliate=affiliate,
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
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Get withdrawal/payout history.
    
    Story: Affiliate checks status of their payout requests
    Shows all past and pending withdrawals
    """
    withdrawals = AffiliateService.get_withdrawals(affiliate, db)
    
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


@router.post("/performance-report")
def get_performance_report(
    request: PerformanceReportRequest,
    affiliate: Affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """
    Generate performance report for a date range.
    
    Story: Affiliate wants monthly/weekly performance analysis
    We aggregate all metrics for that period
    
    - **start_date**: Report start (format: YYYY-MM-DD) - default: 30 days ago
    - **end_date**: Report end (format: YYYY-MM-DD) - default: today
    
    Returns:
    - Total clicks, conversions, earnings
    - Conversion rate
    - EPC (Earnings Per Click)
    - Average commission per conversion
    """
    # Parse dates if provided
    start_date = None
    end_date = None
    
    if request.start_date:
        try:
            start_date = datetime.fromisoformat(request.start_date)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid start_date format. Use YYYY-MM-DD"
            )
    
    if request.end_date:
        try:
            end_date = datetime.fromisoformat(request.end_date)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid end_date format. Use YYYY-MM-DD"
            )
    
    report = AffiliateService.get_performance_report(
        affiliate=affiliate,
        db=db,
        start_date=start_date,
        end_date=end_date
    )
    
    return report


@router.get("/marketing-assets")
def get_marketing_assets(
    affiliate: Affiliate = Depends(get_current_affiliate)
):
    """
    Get marketing materials and assets.
    
    Story: Affiliate needs banners, images, copy for promotion
    We provide downloadable marketing materials
    
    Returns:
    - Banner images in various sizes
    - Sample promotional text
    - Social media templates
    - Email templates
    """
    return {
        "banners": [
            {
                "size": "728x90",
                "name": "Leaderboard Banner",
                "url": "https://gaming-platform.com/assets/banners/728x90.png"
            },
            {
                "size": "300x250",
                "name": "Medium Rectangle",
                "url": "https://gaming-platform.com/assets/banners/300x250.png"
            },
            {
                "size": "160x600",
                "name": "Wide Skyscraper",
                "url": "https://gaming-platform.com/assets/banners/160x600.png"
            },
            {
                "size": "320x50",
                "name": "Mobile Banner",
                "url": "https://gaming-platform.com/assets/banners/320x50.png"
            }
        ],
        "promotional_text": [
            {
                "title": "Short Copy",
                "text": "Join the best gaming platform! Use my link to get exclusive bonuses. 🎰"
            },
            {
                "title": "Medium Copy",
                "text": "Looking for the ultimate gaming experience? I've been using this platform and it's amazing! Sign up through my link and get special welcome bonuses. Safe, fast, and fun! 🎲"
            },
            {
                "title": "Long Copy",
                "text": "I've been exploring different gaming platforms and finally found one that ticks all the boxes. Great game selection, instant deposits, fast withdrawals, and excellent customer support. If you're looking for a reliable platform, use my referral link to join. You'll get exclusive bonuses just for signing up through me. Give it a try - you won't regret it! 🚀"
            }
        ],
        "social_templates": {
            "twitter": f"🎰 Join the action! Use my link: https://gaming-platform.com?ref={affiliate.referral_code} #gaming #casino",
            "facebook": f"Hey friends! Check out this amazing gaming platform I've been using. Sign up with my link for exclusive bonuses: https://gaming-platform.com?ref={affiliate.referral_code}",
            "instagram": f"Link in bio! 🎲 Use code: {affiliate.referral_code} for exclusive bonuses"
        },
        "email_template": f"""
Subject: Exclusive Gaming Platform Invitation

Hi there!

I wanted to share with you an amazing gaming platform I've been using. The experience has been fantastic and I think you'd enjoy it too.

Here's what makes it great:
✅ Wide variety of games
✅ Fast and secure transactions
✅ Excellent customer support
✅ Exclusive bonuses for new users

Use my referral link to join:
https://gaming-platform.com?ref={affiliate.referral_code}

Or use code: {affiliate.referral_code}

Let me know if you have any questions!

Best regards
        """
    }