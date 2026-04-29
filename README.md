# 🚀 Personal Portfolio — Full-Stack Web App

A production-ready portfolio website with a **React (Vite + TailwindCSS)** frontend, **FastAPI** backend, **SQLite/PostgreSQL** database, and **JWT authentication** for the admin dashboard.

---

## 📁 Project Structure

```
ItsmeAngel/
├── frontend/               # React app (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ProjectCard, ContactForm
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── lib/            # Axios API client
│   │   └── pages/          # LandingPage, ProjectDetailPage, AdminLogin, AdminDashboard
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── api/            # Route handlers + deps
│   │   ├── core/           # Config, DB, Security
│   │   ├── models/         # SQLAlchemy ORM models
│   │   └── schemas/        # Pydantic v2 schemas
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 20+
- Python 3.12+
- Git

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd ItsmeAngel
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — set SECRET_KEY, ADMIN_PASSWORD, etc.

# Run the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at http://localhost:8000  
Interactive docs at http://localhost:8000/docs (when `DEBUG=true`)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# .env just needs: VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be at http://localhost:5173

---

## 🔐 Admin Access

Default credentials (change in `.env` before deploying!):
```
Username: admin
Password: ChangeMe@2024!
```

Admin panel: http://localhost:5173/admin/login

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `SECRET_KEY` | JWT signing key (min 32 chars) | ✅ |
| `ADMIN_USERNAME` | Initial admin username | ✅ |
| `ADMIN_PASSWORD` | Initial admin password | ✅ |
| `DATABASE_URL` | DB connection string | ✅ |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | ✅ |
| `SMTP_HOST` | SMTP server for email | ❌ |
| `SMTP_USER` | SMTP username | ❌ |
| `SMTP_PASSWORD` | SMTP password | ❌ |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🐳 Docker Deployment

```bash
# Copy and configure root .env for Docker Compose
copy backend\.env.example .env
# Edit .env with production values

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

Services:
- **Frontend**: http://localhost (port 80)
- **Backend**: http://localhost:8000
- **Database**: PostgreSQL on port 5432 (internal)

---

## ☁️ Cloud Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Push to GitHub, import project in Vercel dashboard
# Set VITE_API_URL to your backend URL in Vercel env settings
```

### Backend → Render / Fly.io

**Render:**
1. Create new Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables in Render dashboard

**Fly.io:**
```bash
cd backend
fly launch
fly secrets set SECRET_KEY=<your-secret> ADMIN_PASSWORD=<password>
fly deploy
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Admin login |
| `GET` | `/auth/me` | Bearer | Current user |
| `GET` | `/projects` | Public | List all projects |
| `GET` | `/projects/:id` | Public | Get single project |
| `POST` | `/projects` | Bearer | Create project |
| `PUT` | `/projects/:id` | Bearer | Update project |
| `DELETE` | `/projects/:id` | Bearer | Delete project |
| `GET` | `/skills` | Public | List all skills |
| `POST` | `/skills` | Bearer | Add skill |
| `PUT` | `/skills/:id` | Bearer | Update skill |
| `DELETE` | `/skills/:id` | Bearer | Delete skill |
| `POST` | `/messages` | Public | Send contact message |
| `GET` | `/messages` | Bearer | List messages (admin) |
| `PATCH` | `/messages/:id/read` | Bearer | Mark message as read |
| `DELETE` | `/messages/:id` | Bearer | Delete message |

---

## 📦 Git Setup

```bash
# Initialize repository (if not already)
git init
git add .
git commit -m "feat: production-ready portfolio app"

# Push to GitHub
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

---

## 🔒 Security Checklist

- [x] JWT with short-lived tokens
- [x] bcrypt password hashing
- [x] CORS properly configured
- [x] Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- [x] Input validation (Pydantic v2)
- [x] Rate limiting (slowapi)
- [x] Non-root Docker user
- [x] Environment variables for all secrets
- [x] No secrets committed to Git
- [ ] Change default admin password before deploying
- [ ] Set `DEBUG=false` in production
- [ ] Configure HTTPS (via Nginx/Caddy or cloud provider)

---

## 🎨 Features

- ✅ Dark/light mode toggle with localStorage persistence
- ✅ Smooth scroll navigation
- ✅ Framer Motion animations
- ✅ Responsive mobile design
- ✅ Contact form with validation
- ✅ Admin CRUD for projects, skills, messages
- ✅ JWT auth with httpOnly-safe cookie storage
- ✅ PostgreSQL (production) + SQLite (development)
- ✅ Docker + docker-compose for full-stack deployment
