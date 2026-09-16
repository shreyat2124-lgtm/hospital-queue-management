# Cura — Smart Hospital Queue Management System

A full-stack hospital queue management system with real-time tracking, role-based dashboards, and an AI-powered triage module. Built to streamline patient flow from registration to consultation.

## Features

### Core System
- **JWT Authentication** with role-based access control (Admin, Doctor, Patient)
- **Token Generation** — sequential per-doctor, per-day numbering with automatic daily reset
- **Priority Queue** — emergency patients are escalated to the front with real-time reordering
- **Dynamic Wait-Time Estimation** — calculated using `position × avgConsultationMinutes` per doctor
- **Real-Time Updates** — Socket.io WebSocket broadcasts push queue changes to all connected clients instantly

### Dashboards
- **Patient Portal** — browse departments, view doctor profiles, book consultations, track token status
- **Doctor Dashboard** — manage patient queue, call next, mark consultations complete
- **Admin Dashboard** — monitor department load, staff availability, and activity logs
- **Queue Display** — public-facing live queue for waiting room screens

### AI Triage System *(In Progress)*
A multi-agent system ([Acuity](https://github.com/shreyat2124-lgtm/Acuity-kaggle-5dgai-capstone)) that reads a patient's free-text symptom description and produces a clinical urgency verdict with visible reasoning:
- **Symptom-Extractor Agent** — converts raw text to structured JSON
- **Severity-Assessor Agent** — evaluates urgency (NORMAL / URGENT / EMERGENCY) using conditionally loaded clinical skill files
- **Escalation Agent** — appends a counterfactual explanation for human verification

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, React Router, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **AI Triage** | Python, FastAPI, Google Gemini API, Pydantic |

## Database Schema

```
Users ──┬── Doctors ──── Tokens (the queue)
        └── Patients ─────┘
                           │
Departments ───────────────┘
```

**5 tables**: `User`, `Department`, `Doctor`, `Patient`, `Token`
- Tokens track the full patient journey: `WAITING → IN_PROGRESS → COMPLETED`
- Priority enum: `NORMAL | URGENT | EMERGENCY`
- Tokens reset daily via `queueDate` field

## Project Structure

```
├── backend/
│   ├── prisma/              # Schema + migrations
│   ├── src/
│   │   ├── middleware/      # JWT auth + role check
│   │   ├── routes/          # auth, doctors, patients, tokens, queues, departments
│   │   ├── services/        # Token generation + wait time logic
│   │   └── server.js        # Express + Socket.io entry point
│   └── seed.js              # Test data seeder
├── frontend/
│   ├── public/images/       # Doctor headshots + hero images
│   └── src/
│       ├── components/      # All page components (7 screens)
│       ├── App.jsx          # React Router setup
│       └── index.css        # Tailwind base styles
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (local or [Neon.tech](https://neon.tech) free tier)

### Setup

1. **Clone**
   ```bash
   git clone https://github.com/shreyat2124-lgtm/hospital-queue-management.git
   cd hospital-queue-management
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key-min-32-chars"
   PORT=3000
   ```
   Run migrations and seed:
   ```bash
   npx prisma migrate dev
   node seed.js
   npm run dev
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Any | Get current user profile |
| GET | `/api/departments` | Any | List all departments |
| GET | `/api/doctors` | Any | List doctors (filter by department) |
| POST | `/api/tokens/book` | Patient | Book a queue token |
| POST | `/api/tokens/emergency` | Admin/Doctor | Add emergency patient |
| POST | `/api/queues/call-next` | Doctor | Call next patient |
| POST | `/api/queues/complete` | Doctor | Complete consultation |
| GET | `/api/queues/status/:doctorId` | Any | Live queue status |

