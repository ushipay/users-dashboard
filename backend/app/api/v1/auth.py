from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import create_db
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.security import create_access_token
from app.schemas.auth import Token
from app.service.auth_service import authenticate_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/token", response_model=Token)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),  # noqa
    db: Session = Depends(create_db),  # noqa
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    acccess_token = create_access_token(
        {"sub": user.username}, expires_delta=timedelta(ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": acccess_token, "token_type": "bearer"}
