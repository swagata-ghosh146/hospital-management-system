from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.patient import Patient
from ..models.user import User, UserRole
from ..schemas.patient import PatientCreate, PatientResponse
from ..core.deps import get_current_user, require_role

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient profile already exists")

    patient = Patient(user_id=current_user.id, **patient_data.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/", response_model=List[PatientResponse])
def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.admin, UserRole.doctor, UserRole.receptionist))
):
    return db.query(Patient).all()

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient