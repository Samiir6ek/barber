from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Annotated

from app.db.database import get_db
from app.models.user import User as DBUser


def get_current_user(
    telegram_id: Annotated[int, Header()], db: Session = Depends(get_db)
) -> DBUser:
    """
    Dependency to get the current user from the database based on a Telegram ID
    passed in the request headers.
    """
    if not telegram_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: Telegram ID header missing",
        )
    
    user = db.query(DBUser).filter(DBUser.telegram_id == telegram_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def get_current_admin_user(
    current_user: DBUser = Depends(get_current_user),
) -> DBUser:
    """

    Dependency to check if the current user is an admin.
    This depends on get_current_user.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user
