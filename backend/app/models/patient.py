from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    phone = Column(String(20))
    date_of_birth = Column(Date)
    gender = Column(String(10))
    blood_group = Column(String(5))
    address = Column(Text)
    emergency_contact = Column(String(100))
    allergies = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="patient_profile")
    appointments = relationship("Appointment", back_populates="patient")