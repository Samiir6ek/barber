from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.appointment import Appointment as DBAppointment
from app.models.user import User as DBUser
from app.models.barber import Barber as DBBarber
from app.models.service import Service as DBService


# Pydantic model for creating an appointment (input schema)
class AppointmentCreate(BaseModel):
    user_id: int
    barber_id: int
    service_id: int
    start_time: datetime
    # end_time will be calculated based on service duration


# Pydantic model for returning an appointment (output schema)
class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    barber_id: int
    service_id: int
    start_time: datetime
    end_time: datetime
    status: str

    class Config:
        from_attributes = True


# Pydantic model for returning an appointment with related details
class AppointmentDetailResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    status: str
    user_name: str
    barber_name: str
    service_name: str
    service_duration: int

    class Config:
        from_attributes = True


router = APIRouter()


@router.post("/appointments/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Validate user, barber, and service exist
    db_user = db.query(DBUser).filter(DBUser.id == appointment.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_barber = db.query(DBBarber).filter(DBBarber.id == appointment.barber_id).first()
    if not db_barber:
        raise HTTPException(status_code=404, detail="Barber not found")

    db_service = db.query(DBService).filter(DBService.id == appointment.service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Calculate end_time based on service duration
    end_time = appointment.start_time + timedelta(minutes=db_service.duration_minutes)

    # Check for time conflicts for the barber
    conflicting_appointment = (
        db.query(DBAppointment)
        .filter(
            DBAppointment.barber_id == appointment.barber_id,
            DBAppointment.status == "booked",  # Only check against booked appointments
            DBAppointment.start_time < end_time,
            DBAppointment.end_time > appointment.start_time,
        )
        .first()
    )
    if conflicting_appointment:
        raise HTTPException(status_code=409, detail="Barber is not available at this time")

    new_appointment = DBAppointment(
        user_id=appointment.user_id,
        barber_id=appointment.barber_id,
        service_id=appointment.service_id,
        start_time=appointment.start_time,
        end_time=end_time,
        status="booked",
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment


@router.get("/appointments/", response_model=List[AppointmentDetailResponse])
def read_appointments(
    user_id: Optional[int] = None,
    barber_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(DBAppointment).options(
        joinedload(DBAppointment.user),
        joinedload(DBAppointment.barber),
        joinedload(DBAppointment.service),
    )

    if user_id:
        query = query.filter(DBAppointment.user_id == user_id)
    if barber_id:
        query = query.filter(DBAppointment.barber_id == barber_id)

    appointments = query.offset(skip).limit(limit).all()

    # Manually map to AppointmentDetailResponse
    response_appointments = []
    for appt in appointments:
        response_appointments.append(
            AppointmentDetailResponse(
                id=appt.id,
                start_time=appt.start_time,
                end_time=appt.end_time,
                status=appt.status,
                user_name=appt.user.name,
                barber_name=appt.barber.name,
                service_name=appt.service.name,
                service_duration=appt.service.duration_minutes,
            )
        )
    return response_appointments


@router.get("/appointments/{appointment_id}", response_model=AppointmentDetailResponse)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = (
        db.query(DBAppointment)
        .options(
            joinedload(DBAppointment.user),
            joinedload(DBAppointment.barber),
            joinedload(DBAppointment.service),
        )
        .filter(DBAppointment.id == appointment_id)
        .first()
    )
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return AppointmentDetailResponse(
        id=appointment.id,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        status=appointment.status,
        user_name=appointment.user.name,
        barber_name=appointment.barber.name,
        service_name=appointment.service.name,
        service_duration=appointment.service.duration_minutes,
    )
