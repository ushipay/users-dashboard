from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import create_db, get_current_user
from app.core.security import hashed_password
from app.crud.user import (
    add_user,
    delete_user,
    get_user_all,
    get_user_by_email,
    get_user_by_id,
    get_user_by_username,
    update_user,
)
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/api/v1/users", tags=["/users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(create_db)) -> User:  # noqa
    if get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User({user.username}) is already exists.",
        )

    user_data = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password(user.password),
    )

    return add_user(db, user_data)


@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(create_db),  # noqa
    current_user: User = Depends(get_current_user),  # noqa
):
    return get_user_all(db)


@router.put("/{user_id}", response_model=UserResponse)
def edit_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(create_db),  # noqa
    current_user: User = Depends(get_current_user),  # noqa
):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User(id={user_id}) does not exists",
        )

    if (email := user_update.email) is not None:
        if get_user_by_email(db, email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"email({user_update.email}) already exists.",
            )

    return update_user(db, current_user, user_update)


@router.delete("/{user_id}")
def deleteUser(
    user_id: int,
    db: Session = Depends(create_db),  # noqa
    current_usr: User = Depends(get_current_user),  # noqa
) -> None:
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User(id={user_id}) is not exists",
        )

    delete_user(db, user)
