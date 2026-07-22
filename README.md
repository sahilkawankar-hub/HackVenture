# 🏘️ CiviLink AI

> AI-powered hyperlocal community platform for apartments, societies, campuses, and local communities.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google Auth** | Firebase Google Authentication for secure sign-in |
| 📰 **Community Feed** | Share posts, comments, and reactions within your community |
| 👁️ **CivicEye AI** | AI-powered civic issue reporting with image detection (YOLO) |
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
- **Firebase SDK** — Google Authentication & Storage
- **Axios** — HTTP client

### Backend
- **FastAPI** — Python async web framework
- **Firebase Admin SDK** — Auth verification & Firestore ORM/ODM driver
- **Firebase Cloud Firestore** — Primary document database
- **Firebase Storage** — Asset storage for images and audio
- **Pydantic** — Request/response data validation

### AI / ML
- **Ultralytics YOLO** — Object detection (CivicEye)
- **Sentence Transformers** — Semantic similarity (Lost & Found matching)
- **Hugging Face Transformers** — Text classification & NLP

### Infrastructure
- **Docker & Docker Compose** — Containerization
- **Firebase** — Authentication, Database, & Cloud Storage
- **Google Maps API** — Geocoding & maps

---

## 📁 Project Structure

```
HackVenture/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/     # Route handlers per feature
│   │   ├── ai/                   # AI/ML model integrations
│   │   ├── core/                 # Security, dependencies, exceptions
│   │   ├── db/                   # Firestore init & seed scripts
│   │   ├── middleware/           # Rate limiter, etc.
│   │   ├── models/              # Firestore document schema helpers
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer backed by Firestore
│   │   ├── utils/               # Firebase Admin, storage, maps helpers
│   │   ├── config.py            # Pydantic Settings configuration
│   │   ├── database.py          # Firebase Admin SDK & Firestore client init
│   │   └── main.py              # FastAPI app entry point
│   ├── tests/                   # Pytest test suite
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                 # API service functions per feature
│   │   ├── components/
│   │   ├── context/             # React contexts (AuthContext, etc.)
│   │   ├── hooks/               # Custom React hooks (useAuth, etc.)
│   │   ├── lib/                 # Third-party configs (Firebase, Axios, Maps)
│   │   ├── pages/               # Route page components
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
- **Firebase Project** (Auth, Firestore, Storage enabled)
- **Docker** (optional)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Firebase configuration

# Seed Firestore database (optional)
python -m app.db.init_db --seed

# Start the server
uvicorn app.main:app --reload
```

Backend API available at `http://localhost:8000`
Swagger API docs at `http://localhost:8000/api/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Firebase project keys

# Start dev server
npm run dev
```

Frontend available at `http://localhost:5173`

---

## 📄 License

Built for hackathon. All rights reserved.
