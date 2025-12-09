from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    barber_id = Column(Integer, ForeignKey("barbers.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="booked", nullable=False) # e.g., 'booked', 'completed', 'cancelled'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Define relationships
    user = relationship("User", backref="appointments")
    barber = relationship("Barber", backref="appointments")
    service = relationship("Service", backref="appointments")

    def __repr__(self):
        return f"<Appointment(id={self.id}, user_id={self.user_id}, barber_id={self.barber_id}, start_time='{self.start_time}')>"
