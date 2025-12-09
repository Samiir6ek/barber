from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional

from app.db.database import get_db
from app.models.barber import Barber as DBBarber


# Pydantic model for creating a barber (input schema)
class BarberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    nickname: Optional[str] = Field(None, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    experience_years: Optional[int] = Field(None, ge=0)
    telegram_id: Optional[int] = None # Optional: Link to Telegram user


# Pydantic model for returning a barber (output schema)
class BarberResponse(BaseModel):
    id: int
    name: str
    nickname: Optional[str]
    bio: Optional[str]
    experience_years: Optional[int]
    telegram_id: Optional[int]

    class Config:
        from_attributes = True


router = APIRouter()


@router.post("/barbers/", response_model=BarberResponse, status_code=201)
def create_barber(barber: BarberCreate, db: Session = Depends(get_db)):
    # Check if a barber with the same name already exists (optional, but good for uniqueness)
    db_barber = db.query(DBBarber).filter(DBBarber.name == barber.name).first()
    if db_barber:
        raise HTTPException(status_code=400, detail="Barber with this name already exists")

    new_barber = DBBarber(**barber.model_dump())
    db.add(new_barber)
    db.commit()
    db.refresh(new_barber)
    return new_barber


@router.get("/barbers/", response_model=List[BarberResponse])
def read_barbers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    barbers = db.query(DBBarber).offset(skip).limit(limit).all()
    return barbers


@router.get("/barbers/{barber_id}", response_model=BarberResponse)
def read_barber(barber_id: int, db: Session = Depends(get_db)):
    db_barber = db.query(DBBarber).filter(DBBarber.id == barber_id).first()
    if db_barber is None:
        raise HTTPException(status_code=404, detail="Barber not found")
    return db_barber


@router.delete("/barbers/{barber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_barber(barber_id: int, db: Session = Depends(get_db)):
    db_barber = db.query(DBBarber).filter(DBBarber.id == barber_id).first()
    if db_barber is None:
        raise HTTPException(status_code=404, detail="Barber not found")
    
    db.delete(db_barber)
    db.commit()
    return {"message": "Barber deleted successfully"}
