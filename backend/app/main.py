from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import auth, patients, appointments
from .models import user, patient, doctor, appointment

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Management System API",
    description="AI-Powered Hospital Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)

@app.get("/")
def root():
    return {"message": "Hospital Management System API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}