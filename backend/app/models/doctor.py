from sqlalchemy import Column, Integer, String, ForeignKey, Text, Numeric, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialization = Column(String(100))
    license_number = Column(String(50), unique=True)
    phone = Column(String(20))
    experience_years = Column(Integer)
    consultation_fee = Column(Numeric(10, 2))
    bio = Column(Text)
    available_days = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor")