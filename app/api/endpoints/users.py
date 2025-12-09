from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.user import User as DBUser


# Pydantic model for creating a user (what we expect from the bot)
class UserCreate(BaseModel):
    telegram_id: int
    name: str
    phone_number: str


# Pydantic model for returning a user (what we send back)
class UserResponse(BaseModel):
    id: int
    telegram_id: int
    name: str
    phone_number: str

    class Config:
        from_attributes = True # For Pydantic v2, use from_attributes=True instead of orm_mode=True


router = APIRouter()


@router.get("/users/{telegram_id}", response_model=UserResponse)
def read_user(telegram_id: int, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.telegram_id == telegram_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(DBUser).filter(DBUser.telegram_id == user.telegram_id).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")

    # Create new user
    db_user = DBUser(
        telegram_id=user.telegram_id,
        name=user.name,
        phone_number=user.phone_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

