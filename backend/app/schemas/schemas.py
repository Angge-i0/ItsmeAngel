"""
Pydantic v2 schemas for request / response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Auth ─────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    username: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Project ──────────────────────────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    long_description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    image_url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    live_url: Optional[str] = Field(None, max_length=500)
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    long_description: Optional[str] = None
    tags: Optional[list[str]] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[bool] = None


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    # ORM stores tags as CSV string; convert on read
    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()] if v else []
        return v or []

    model_config = {"from_attributes": True}


# ── Skill ────────────────────────────────────────────────────────────────
class SkillBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(default="other", max_length=50)
    level: int = Field(default=80, ge=0, le=100)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = None
    level: Optional[int] = Field(None, ge=0, le=100)


class SkillOut(SkillBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Message ──────────────────────────────────────────────────────────────
class MessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)


class MessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# Resolve forward references
TokenResponse.model_rebuild()
