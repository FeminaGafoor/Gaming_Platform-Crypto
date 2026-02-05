from sqlalchemy.orm import Session
from datetime import datetime
import secrets
import string

from ..models.user import User, UserRole
from ..models.agent import Agent
from ..models.affiliate import Affiliate
from ..utils.security import get_password_hash, verify_password, create_access_token


class AuthService:
    """Handle authentication operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def register(self, email: str, password: str, role: str) -> dict:
        """Register a new user"""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        # Validate role
        if role not in ['agent', 'affiliate']:
            raise ValueError("Invalid role")
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # Create user
        user = User(
            email=email,
            password_hash=hashed_password,
            role=UserRole.AGENT if role == 'agent' else UserRole.AFFILIATE,
            created_at=datetime.utcnow()
        )
        
        self.db.add(user)
        self.db.flush()
        
        # Create role-specific profile
        if role == 'agent':
            agent = Agent(
                user_id=user.id,
                commission_rate=0.10,
                total_earnings=0.0,
                withdrawable_balance=0.0,
                created_at=datetime.utcnow()
            )
            self.db.add(agent)
        else:
            referral_code = self._generate_referral_code()
            affiliate = Affiliate(
                user_id=user.id,
                referral_code=referral_code,
                total_clicks=0,
                total_registrations=0,
                total_conversions=0,
                total_earnings=0.0,
                withdrawable_balance=0.0,
                commission_type='CPA',
                cpa_amount=50.0,
                created_at=datetime.utcnow()
            )
            self.db.add(affiliate)
        
        self.db.commit()
        
        # Create token
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "role": user.role.value
            }
        }
    
    def login(self, email: str, password: str) -> dict:
        """Login user"""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise ValueError("Invalid email or password")
        
        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")
        
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role.value}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "role": user.role.value
            }
        }
    
    def _generate_referral_code(self) -> str:
        """Generate unique referral code"""
        while True:
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            existing = self.db.query(Affiliate).filter(Affiliate.referral_code == code).first()
            if not existing:
                return code
