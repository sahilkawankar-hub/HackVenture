# 🏘️ CiviLink AI

> AI-powered hyperlocal community platform for apartments, societies, campuses, and local communities — powered by **Supabase** and **YOLO AI**.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Supabase Authentication using Google OAuth for secure sign-in |
| 📰 **Community Feed** | Share posts, comments, and reactions within your community |
| 👁️ **CivicEye AI** | AI-powered civic issue reporting with YOLO object detection & automatic priority rating |
| 🔍 **Lost & Found** | Report lost/found items with AI-powered semantic matching |
| 🛒 **Marketplace** | Buy, sell, and trade items locally within your community |
| 💼 **Local Jobs** | Post and discover hyperlocal job opportunities |
| ⚙️ **Admin Dashboard** | Platform administration, analytics, and content moderation |
| 🗺️ **Google Maps** | Location-based features with maps integration |

---

## 🏗️ Tech Stack

### Frontend
- **React** + **TypeScript** — UI framework
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **@supabase/supabase-js** — Supabase Auth & Storage client
- **Axios** — HTTP client

### Backend
- **FastAPI** — Python async web framework for AI processing & REST services
- **Supabase Python SDK** — PostgreSQL driver, Auth verification, and Storage bucket interface
- **Supabase PostgreSQL** — Primary relational database (`civic_issues`, `posts`, `users`, etc.)
- **Supabase Storage** — Asset storage for images (`civic-images` bucket)
- **Pydantic** — Request/response data validation

### AI / ML
- **Ultralytics YOLO** — Object detection (CivicEye vision analysis)
- **Sentence Transformers** — Semantic similarity (Lost & Found matching)
- **Hugging Face Transformers** — Text classification & NLP

### Infrastructure
- **Supabase** — Authentication, PostgreSQL Database & Storage (`civic-images` bucket)
- **Docker & Docker Compose** — Containerization
- **Google Maps API** — Geocoding & maps

---

## 📁 Project Structure

```
HackVenture/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/     # Route handlers per feature
│   │   ├── ai/                   # AI/ML model integrations (YOLO)
│   │   ├── core/                 # Security, dependencies, exceptions
│   │   ├── db/                   # Supabase PostgreSQL schema DDL (schema.sql)
│   │   ├── middleware/           # Rate limiter, etc.
│   │   ├── models/              # Data model structure helpers
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer backed by Supabase
│   │   ├── utils/               # Supabase DB, storage ('civic-images'), maps helpers
│   │   ├── config.py            # Pydantic Settings configuration
│   │   ├── database.py          # Supabase client init
│   │   └── main.py              # FastAPI app entry point
│   ├── tests/                   # Pytest test suite
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                 # API service functions per feature
│   │   ├── components/          # CivicEye, Feed, Marketplace components
│   │   ├── context/             # React contexts (AuthContext with Supabase)
│   │   ├── hooks/               # Custom React hooks (useAuth, etc.)
│   │   ├── lib/                 # Supabase client (supabase.ts), Axios
│   │   ├── pages/               # Route page components (CivicEye, Login, etc.)
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Helper functions
│   │   ├── constants/           # App-wide constants
│   │   ├── App.tsx              # Root component with routes
│   │   └── main.tsx             # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **Supabase Project** (URL, Anon key, Service Role key, and `civic-images` storage bucket)
- **Docker** (optional)

### 1. Database Setup (Supabase PostgreSQL)

Execute the schema DDL in your Supabase SQL Editor:
```sql
-- See backend/app/db/schema.sql for the complete DDL script.
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase URL & Key

# Start the FastAPI AI server
uvicorn app.main:app --reload
```

Backend API available at `http://localhost:8000`  
Swagger API docs at `http://localhost:8000/api/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start dev server
npm run dev
```

Frontend available at `http://localhost:5173`

---

## 📄 License

Built for hackathon. All rights reserved.
