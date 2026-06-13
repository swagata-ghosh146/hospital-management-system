from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class PatientCreate(BaseModel):
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    allergies: Optional[str] = None

class PatientResponse(BaseModel):
    id: int
    user_id: int
    phone: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[str]
    blood_group: Optional[str]
    address: Optional[str]
    emergency_contact: Optional[str]
    allergies: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True