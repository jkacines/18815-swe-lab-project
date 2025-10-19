from pydantic import BaseModel
from typing import Optional

# Login Request model
class LoginRequest(BaseModel):
    id: Optional[str] = None
    username: str
    password: str

# Response models
class UserResponse(BaseModel):
    id: Optional[str] = None
    username: str

class LoginSuccessResponse(BaseModel):
    id: Optional[str] = None
    success: bool
    message: str
    user: UserResponse

class LoginErrorResponse(BaseModel):
    id: Optional[str] = None
    success: bool
    message: str

# Request model
class RegisterRequest(BaseModel):
    id: Optional[str] = None
    username: str
    password: str
    email: Optional[str] = None
    birthday: Optional[str] = None  # or use date type

# Response models
class RegisterSuccessResponse(BaseModel):
    id: Optional[str] = None
    success: bool
    message: str