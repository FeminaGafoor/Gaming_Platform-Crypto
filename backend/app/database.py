from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create database engine
# Think of this as building the connection highway to your database
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Check if connection is alive before using
    echo=False  # Disabled for production - enable locally if debugging
)

# Create SessionLocal class
# Think of this as creating a "meeting room" factory
# Each API request gets its own meeting room (session) to talk to the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class
# All database models will inherit from this
# Think of this as the blueprint template for all your filing cabinets
Base = declarative_base()

def get_db():
    """
    Dependency function that provides database session to routes.
    
    Think of this as a doorman who:
    1. Opens the door (creates session)
    2. Lets you work (yield session)
    3. Closes the door after you're done (finally block)
    
    This is called "Dependency Injection" - a fancy term for 
    "giving functions what they need automatically"
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()