from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.crud.user import get_user_by_username
from app.db.session import sessionLocal
from app.schemas.user import UserCreate


def create_db():
    session = sessionLocal()
    try:
        yield session
    finally:
        session.close()


oauth2_schema = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


def get_current_user(
    token: str = Depends(oauth2_schema),
    db: Session = Depends(create_db),  # noqa
) -> UserCreate:
    token_data = decode_access_token(token)
    user = get_user_by_username(db, username=token_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user
