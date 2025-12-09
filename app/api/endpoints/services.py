from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal

from app.db.database import get_db
from app.models.service import Service as DBService


# Pydantic model for creating a service (input schema)
class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    duration_minutes: int = Field(..., gt=0)
    price: Optional[Decimal] = Field(None, decimal_places=2)
    description: Optional[str] = Field(None, max_length=500)


# Pydantic model for returning a service (output schema)
class ServiceResponse(BaseModel):
    id: int
    name: str
    duration_minutes: int
    price: Optional[Decimal]
    description: Optional[str]

    class Config:
        from_attributes = True


router = APIRouter()


@router.post("/services/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = db.query(DBService).filter(DBService.name == service.name).first()
    if db_service:
        raise HTTPException(status_code=400, detail="Service with this name already exists")

    new_service = DBService(**service.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


@router.get("/services/", response_model=List[ServiceResponse])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    services = db.query(DBService).offset(skip).limit(limit).all()
    return services


@router.get("/services/{service_id}", response_model=ServiceResponse)
def read_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(DBService).filter(DBService.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service
