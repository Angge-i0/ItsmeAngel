"""
FastAPI application factory.
Wires up middleware, CORS, rate-limiting, routes, and database seed.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.routes import auth, projects, skills, messages
from app.core.config import get_settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models import User

settings = get_settings()
logger = logging.getLogger(__name__)

# ── Rate limiter ─────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


# ── Lifespan: DB init + admin seed ───────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Seed admin user if none exists
    db = SessionLocal()
    try:
        if not db.query(User).first():
            admin = User(
                username=settings.ADMIN_USERNAME,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
            )
            db.add(admin)
            db.commit()
            logger.info("Admin user seeded: %s", settings.ADMIN_USERNAME)
    finally:
        db.close()

    yield  # Application runs here

    logger.info("Shutting down…")


# ── App factory ──────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Security headers middleware
    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    # Routers
    app.include_router(auth.router)
    app.include_router(projects.router)
    app.include_router(skills.router)
    app.include_router(messages.router)

    # Health check
    @app.get("/health", tags=["health"])
    def health():
        return {"status": "ok", "version": settings.VERSION}

    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )

    return app


app = create_app()
