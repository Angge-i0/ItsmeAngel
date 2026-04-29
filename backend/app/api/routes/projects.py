"""
Projects CRUD – public GET, protected POST/PUT/DELETE.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Project, User
from app.schemas import ProjectCreate, ProjectOut, ProjectUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])


def _tags_to_str(tags: list[str] | None) -> str:
    return ",".join(t.strip() for t in tags if t.strip()) if tags else ""


# ── Public ────────────────────────────────────────────────────────────────
@router.get("/", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    """Return all projects ordered by featured first, then newest."""
    return (
        db.query(Project)
        .order_by(Project.featured.desc(), Project.created_at.desc())
        .all()
    )


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p


# ── Protected ─────────────────────────────────────────────────────────────
@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    project = Project(
        **payload.model_dump(exclude={"tags"}),
        tags=_tags_to_str(payload.tags),
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = payload.model_dump(exclude_none=True)
    if "tags" in update_data:
        update_data["tags"] = _tags_to_str(update_data["tags"])

    for field, value in update_data.items():
        setattr(p, field, value)

    db.commit()
    db.refresh(p)
    return p


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
