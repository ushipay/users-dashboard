from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserUpdate


def get_user_by_id(db: Session, id: int) -> User | None:
    return db.query(User).filter(User.id == id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def add_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    return user


def get_user_all(db: Session) -> list[User]:
    return db.query(User).all()


def update_user(db: Session, user: User, update_user: UserUpdate) -> User:
    for key, value in update_user.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
