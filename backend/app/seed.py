from datetime import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from .database import SessionLocal
from .models.user import User, UserRole
from .models.agent import Agent
from .models.affiliate import Affiliate
from .models.player import Player
from .models.commission import Commission, CommissionType
from .models.withdrawal import Withdrawal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def seed():
    db: Session = SessionLocal()
    try:
        # ----- Check if already seeded -----
        existing_agent = db.query(User).filter(User.email == "agent@test.com").first()
        if existing_agent:
            print("✅ Seed already exists. Skipping.")
            return

        # ----- Create Users -----
        agent_user = User(
            email="agent@test.com",
            password_hash=hash_password("password123"),
            role=UserRole.AGENT,
            created_at=datetime.utcnow()
        )

        affiliate_user = User(
            email="affiliate@test.com",
            password_hash=hash_password("password123"),
            role=UserRole.AFFILIATE,
            created_at=datetime.utcnow()
        )

        db.add(agent_user)
        db.add(affiliate_user)
        db.commit()
        db.refresh(agent_user)
        db.refresh(affiliate_user)

        # ----- Create Agent + Affiliate -----
        agent = Agent(
            user_id=agent_user.id,
            commission_rate=0.10,
            total_earnings=500.0,
            withdrawable_balance=300.0,
            created_at=datetime.utcnow()
        )

        affiliate = Affiliate(
            user_id=affiliate_user.id,
            referral_code="AFF123",
            total_clicks=120,
            total_registrations=40,
            total_conversions=12,
            total_earnings=260.0,
            withdrawable_balance=150.0,
            cpa_amount=25.0,
            created_at=datetime.utcnow()
        )

        db.add(agent)
        db.add(affiliate)
        db.commit()
        db.refresh(agent)
        db.refresh(affiliate)

        # ----- Create Players -----
        players = [
            Player(
                agent_id=agent.id,
                username="player1",
                email="player1@test.com",
                status="ACTIVE",
                total_deposits=200.0,
                total_losses=50.0,
                created_at=datetime.utcnow()
            ),
            Player(
                agent_id=agent.id,
                username="player2",
                email="player2@test.com",
                status="BLOCKED",
                total_deposits=100.0,
                total_losses=20.0,
                created_at=datetime.utcnow()
            ),
        ]
        db.add_all(players)
        db.commit()

        # ----- Create Commissions -----
        commissions = [
            Commission(
                agent_id=agent.id,
                amount=50.0,
                commission_type=CommissionType.REVENUE_SHARE,
                description="Player loss commission",
                created_at=datetime.utcnow()
            ),
            Commission(
                affiliate_id=affiliate.id,
                amount=25.0,
                commission_type=CommissionType.CPA,
                description="CPA payout",
                created_at=datetime.utcnow()
            ),
        ]
        db.add_all(commissions)
        db.commit()

        # ----- Create Withdrawals -----
        withdrawals = [
            Withdrawal(
                user_id=agent_user.id,
                agent_id=agent.id,
                affiliate_id=None,
                amount=100.0,
                status="PENDING",
                payment_method="bank_transfer",
                payment_details="Demo Bank Account",
                requested_at=datetime.utcnow()
            ),
            Withdrawal(
                user_id=affiliate_user.id,
                agent_id=None,
                affiliate_id=affiliate.id,
                amount=50.0,
                status="APPROVED",
                payment_method="paypal",
                payment_details="affiliate@test.com",
                requested_at=datetime.utcnow(),
                processed_at=datetime.utcnow()
            ),
        ]
        db.add_all(withdrawals)
        db.commit()

        print("✅ Database seeded successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
