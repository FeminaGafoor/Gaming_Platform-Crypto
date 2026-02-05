"""
Script to add dummy balance to agent and affiliate test accounts.
Run this with: python -m backend.add_dummy_balance
"""

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.agent import Agent
from app.models.affiliate import Affiliate
from app.models.commission import Commission
from datetime import datetime


def add_dummy_balance():
    db = SessionLocal()
    try:
        # Find agent test account
        agent_user = db.query(User).filter(
            User.email == "agent@test.com",
            User.role == UserRole.AGENT
        ).first()

        if agent_user:
            agent = db.query(Agent).filter(Agent.user_id == agent_user.id).first()
            if agent:
                # Add dummy balance
                agent.total_earnings = 5000.00
                agent.withdrawable_balance = 2500.00

                # Add some commission records for realism
                for i in range(5):
                    commission = Commission(
                        agent_id=agent.id,
                        affiliate_id=None,
                        player_id=1,  # Dummy player
                        amount=500.00,
                        commission_type="deposit",
                        created_at=datetime.utcnow()
                    )
                    db.add(commission)

                print(f"✅ Added balance to agent: Total: $5000, Withdrawable: $2500")

        # Find affiliate test account
        affiliate_user = db.query(User).filter(
            User.email == "affiliate@test.com",
            User.role == UserRole.AFFILIATE
        ).first()

        if affiliate_user:
            affiliate = db.query(Affiliate).filter(Affiliate.user_id == affiliate_user.id).first()
            if affiliate:
                # Add dummy balance
                affiliate.total_earnings = 3000.00
                affiliate.withdrawable_balance = 1500.00
                affiliate.total_clicks = 250
                affiliate.total_registrations = 45
                affiliate.total_conversions = 15

                # Add some commission records for realism
                for i in range(3):
                    commission = Commission(
                        agent_id=None,
                        affiliate_id=affiliate.id,
                        player_id=1,  # Dummy player
                        amount=500.00,
                        commission_type="cpa",
                        created_at=datetime.utcnow()
                    )
                    db.add(commission)

                print(f"✅ Added balance to affiliate: Total: $3000, Withdrawable: $1500")

        db.commit()
        print("\n🎉 Successfully added dummy balances!")
        print("\nYou can now test withdrawals with:")
        print("- Agent: $2500 available")
        print("- Affiliate: $1500 available")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    add_dummy_balance()
