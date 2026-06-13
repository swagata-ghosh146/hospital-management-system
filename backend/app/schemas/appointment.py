from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.appointment import AppointmentStatus

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: datetime
    reason: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    reason: Optional[str]
    status: AppointmentStatus
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True