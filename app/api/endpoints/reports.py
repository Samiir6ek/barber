from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from pydantic import BaseModel
from typing import List

from app.db.database import get_db
from app.models.appointment import Appointment as DBAppointment
from app.models.barber import Barber as DBBarber
from app.core.auth import get_current_admin_user
from app.models.user import User as DBUser # For dependency injection


# Pydantic model for the report response
class MonthlyReportItem(BaseModel):
    barber_id: int
    barber_name: str
    completed_appointments: int

class MonthlyReportResponse(BaseModel):
    year: int
    month: int
    report: List[MonthlyReportItem]


router = APIRouter()


@router.get("/reports/monthly", response_model=MonthlyReportResponse)
def get_monthly_report(
    year: int, 
    month: int, 
    db: Session = Depends(get_db), 
    admin_user: DBUser = Depends(get_current_admin_user)
):
    """
    Generates a monthly report of completed appointments for each barber.
    Only accessible by admin users.
    """
    if not (1 <= month <= 12):
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    # Query to group appointments by barber and count the completed ones for the given month and year
    report_query = (
        db.query(
            DBBarber.id,
            DBBarber.name,
            func.count(DBAppointment.id).label("completed_appointments"),
        )
        .outerjoin(DBAppointment, DBBarber.id == DBAppointment.barber_id)
        .filter(
            DBAppointment.status == "completed",
            extract("year", DBAppointment.start_time) == year,
            extract("month", DBAppointment.start_time) == month,
        )
        .group_by(DBBarber.id, DBBarber.name)
        .all()
    )

    report_data = [
        MonthlyReportItem(
            barber_id=barber_id,
            barber_name=barber_name,
            completed_appointments=count,
        )
        for barber_id, barber_name, count in report_query
    ]

    return MonthlyReportResponse(year=year, month=month, report=report_data)
