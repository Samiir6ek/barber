from sqlalchemy import Column, Integer, String, DateTime, BigInteger, Text # Import Text for potentially long JSON strings
from sqlalchemy.sql import func
from app.db.database import Base


class Barber(Base):
    __tablename__ = "barbers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    nickname = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    telegram_id = Column(BigInteger, unique=True, index=True, nullable=True) # Optional: Link to Telegram user
    subscription_status = Column(String, default="inactive", nullable=False) # e.g., 'active', 'inactive', 'past_due'
    portfolio_images = Column(Text, default="[]", nullable=False) # Stores JSON string of image URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Barber(id={self.id}, name='{self.name}', status='{self.subscription_status}')>"
