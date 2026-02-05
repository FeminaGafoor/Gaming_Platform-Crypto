from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..utils.dependencies import get_current_affiliate
from ..services.affiliate_service import AffiliateService

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard(
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get affiliate dashboard stats"""
    service = AffiliateService(db)
    return service.get_dashboard_stats(affiliate.id)

@router.get("/referral-link")
async def get_referral_link(
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get referral link and marketing materials"""
    service = AffiliateService(db)
    return service.get_referral_link(affiliate.id)

@router.get("/clicks")
async def get_clicks(
    skip: int = 0,
    limit: int = 100,
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get click history"""
    service = AffiliateService(db)
    return service.get_clicks(affiliate.id, skip, limit)

@router.get("/conversions")
async def get_conversions(
    skip: int = 0,
    limit: int = 100,
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get converted players"""
    service = AffiliateService(db)
    return service.get_conversions(affiliate.id, skip, limit)

@router.get("/commissions")
async def get_commissions(
    skip: int = 0,
    limit: int = 100,
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get commission history"""
    service = AffiliateService(db)
    return service.get_commissions(affiliate.id, skip, limit)

@router.get("/withdrawals")
async def get_withdrawals(
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get withdrawal history"""
    service = AffiliateService(db)
    # Use affiliate.user_id
    return service.get_withdrawals(affiliate.user_id)

@router.post("/withdrawals")
async def request_withdrawal(
    withdrawal_data: dict,
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Request a withdrawal"""
    service = AffiliateService(db)
    # Use affiliate.user_id and affiliate.id
    return service.request_withdrawal(affiliate.user_id, affiliate.id, withdrawal_data)

@router.get("/marketing-assets")
async def get_marketing_assets(
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get marketing assets"""
    service = AffiliateService(db)
    return service.get_marketing_assets(affiliate.id)

@router.post("/performance-report")
async def get_performance_report(
    report_data: dict,
    affiliate = Depends(get_current_affiliate),
    db: Session = Depends(get_db)
):
    """Get performance report for date range"""
    service = AffiliateService(db)
    return service.get_performance_report(affiliate.id, report_data)
