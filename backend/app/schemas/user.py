from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    email: str | None = None


class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    disabled: bool | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    disabled: bool
