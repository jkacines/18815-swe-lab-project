from pydantic import BaseModel
from typing import Optional

class UserLogin(BaseModel):
    id: Optional[str]
    userName: str
    passWrod: str