"""
Script to create an admin user.

Usage:
    python create_admin.py

Or with custom credentials:
    python create_admin.py --email admin@example.com --password yourpassword
"""

import argparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import get_settings
from app.models.user import User, UserRole
from app.utils.auth import get_password_hash
import sys

def create_admin_user(email: str, password: str):
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.email == email).first()

        if existing_admin:
            if existing_admin.role == UserRole.ADMIN:
                print(f"⚠️  Admin user with email '{email}' already exists.")

                # Ask if they want to update password
                update = input("Would you like to update the password? (yes/no): ").lower()
                if update in ['yes', 'y']:
                    existing_admin.password_hash = get_password_hash(password)
                    db.commit()
                    print(f"✅ Password updated for admin user: {email}")
                else:
                    print("No changes made.")
                return
            else:
                print(f"⚠️  User with email '{email}' exists but is not an admin (role: {existing_admin.role.value})")
                update = input("Would you like to convert this user to admin? (yes/no): ").lower()
                if update in ['yes', 'y']:
                    existing_admin.role = UserRole.ADMIN
                    existing_admin.password_hash = get_password_hash(password)
                    db.commit()
                    print(f"✅ User converted to admin: {email}")
                else:
                    print("No changes made.")
                return

        # Create new admin user
        print(f"🔐 Creating admin user: {email}")

        admin_user = User(
            email=email,
            password_hash=get_password_hash(password),
            role=UserRole.ADMIN
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"✅ Admin user created successfully!")
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 Role: {admin_user.role.value}")
        print(f"\n⚠️  Please save these credentials securely and change the password after first login!")

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an admin user for the gaming platform")
    parser.add_argument(
        "--email",
        type=str,
        default="admin@gamingplatform.com",
        help="Admin email address (default: admin@gamingplatform.com)"
    )
    parser.add_argument(
        "--password",
        type=str,
        default="Admin@123",
        help="Admin password (default: Admin@123)"
    )

    args = parser.parse_args()

    print("=" * 60)
    print("🎮 Gaming Platform - Admin User Creation")
    print("=" * 60)
    print()

    create_admin_user(args.email, args.password)
