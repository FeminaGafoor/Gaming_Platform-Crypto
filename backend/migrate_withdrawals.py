"""
Migration script to add admin approval fields to withdrawals table.
Run this once to update the database schema.

Usage:
    python migrate_withdrawals.py
"""

from sqlalchemy import create_engine, text
from app.config import get_settings
import sys

def run_migration():
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)

    print("🔄 Starting migration for withdrawals table...")

    with engine.connect() as conn:
        # Check if columns already exist
        check_columns = text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'withdrawals'
            AND column_name IN ('approved_by', 'approved_at', 'rejection_reason', 'admin_notes');
        """)

        try:
            result = conn.execute(check_columns)
            existing_columns = [row[0] for row in result]

            if len(existing_columns) == 4:
                print("✅ All columns already exist. Migration not needed.")
                return

            print(f"📊 Found {len(existing_columns)} existing columns: {existing_columns}")

            # Add missing columns
            migrations = []

            if 'approved_by' not in existing_columns:
                migrations.append(
                    "ALTER TABLE withdrawals ADD COLUMN approved_by INTEGER REFERENCES users(id);"
                )

            if 'approved_at' not in existing_columns:
                migrations.append(
                    "ALTER TABLE withdrawals ADD COLUMN approved_at TIMESTAMP;"
                )

            if 'rejection_reason' not in existing_columns:
                migrations.append(
                    "ALTER TABLE withdrawals ADD COLUMN rejection_reason VARCHAR;"
                )

            if 'admin_notes' not in existing_columns:
                migrations.append(
                    "ALTER TABLE withdrawals ADD COLUMN admin_notes VARCHAR;"
                )

            # Execute migrations
            for migration_sql in migrations:
                print(f"⚙️  Executing: {migration_sql}")
                conn.execute(text(migration_sql))

            conn.commit()
            print(f"✅ Successfully added {len(migrations)} columns to withdrawals table!")

        except Exception as e:
            print(f"❌ Migration failed: {e}")
            conn.rollback()
            sys.exit(1)

if __name__ == "__main__":
    run_migration()
