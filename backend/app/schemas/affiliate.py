from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class AffiliateBase(BaseModel):
    """Base affiliate information"""
    pass

class AffiliateCreate(BaseModel):
    """
    Creating a new affiliate account.
    System auto-generates referral code.
    """
    commission_type: str = Field(default="cpa", description="cpa, revshare, or hybrid")
    cpa_amount: float = Field(default=50.0, ge=0, description="CPA amount per conversion")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "commission_type": "cpa",
                "cpa_amount": 75.00
            }
        }
    )

class AffiliateResponse(AffiliateBase):
    """
    Affiliate profile information.
    """
    id: int
    user_id: int
    referral_code: str
    total_clicks: int
    total_registrations: int
    total_conversions: int
    total_earnings: float
    withdrawable_balance: float
    commission_type: str
    cpa_amount: float
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AffiliateDashboard(BaseModel):
    """
    Dashboard statistics for affiliate.
    
    Marketing funnel view:
    - Clicks → Registrations → Conversions
    - Conversion rates
    - Earnings
    """
    total_clicks: int
    total_registrations: int
    total_conversions: int
    click_to_reg_rate: float  # Percentage
    reg_to_conversion_rate: float  # Percentage
    total_earnings: float
    withdrawable_balance: float
    last_7_days_clicks: List[dict]
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_clicks": 1250,
                "total_registrations": 98,
                "total_conversions": 23,
                "click_to_reg_rate": 7.84,
                "reg_to_conversion_rate": 23.47,
                "total_earnings": 1725.00,
                "withdrawable_balance": 1200.00,
                "last_7_days_clicks": [
                    {"date": "2024-01-15", "clicks": 45, "conversions": 3}
                ]
            }
        }
    )

class ReferralLinkResponse(BaseModel):
    """
    Affiliate's unique referral link.
    
    Like getting your custom promo code:
    example.com?ref=ABC123XYZ
    """
    referral_code: str
    referral_url: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "referral_code": "FEM2024",
                "referral_url": "https://gaming-platform.com?ref=FEM2024"
            }
        }
    )

class ClickResponse(BaseModel):
    """
    Click tracking record.
    """
    id: int
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    converted: bool
    clicked_at: datetime
    
    model_config = ConfigDict(from_attributes=True)