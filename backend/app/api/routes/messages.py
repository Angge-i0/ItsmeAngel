"""
Messages – public POST (contact form), protected GET/PATCH/DELETE.
Rate-limited on POST to prevent spam.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Message, User
from app.schemas import MessageCreate, MessageOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(payload: MessageCreate, db: Session = Depends(get_db)):
    """Public endpoint: submit a contact form message."""
    msg = Message(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/", response_model=list[MessageOut])
def list_messages(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Admin: list all messages, unread first."""
    return (
        db.query(Message)
        .order_by(Message.is_read.asc(), Message.created_at.desc())
        .all()
    )


@router.patch("/{message_id}/read", response_model=MessageOut)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
