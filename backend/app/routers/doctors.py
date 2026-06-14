from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models.doctor import Doctor
from ..models.user import User
from ..core.deps import get_current_user

router = APIRouter(prefix="/doctors", tags=["Doctors"])

class DoctorCreate(BaseModel):
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    consultation_fee: Optional[float] = None
    bio: Optional[str] = None
    available_days: Optional[str] = None

class DoctorResponse(BaseModel):
    id: int
    user_id: int
    specialization: Optional[str]
    license_number: Optional[str]
    phone: Optional[str]
    experience_years: Optional[int]
    consultation_fee: Optional[float]
    bio: Optional[str]
    available_days: Optional[str]

    class Config:
        from_attributes = True

@router.post("/", response_model=DoctorResponse)
def create_doctor(
    doctor_data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Doctor profile already exists")

    doctor = Doctor(user_id=current_user.id, **doctor_data.model_dump())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/", response_model=List[DoctorResponse])
def get_doctors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Doctor).all()

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor