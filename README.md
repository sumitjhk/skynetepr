# Skynet EPR — AIRMAN Academy

Electronic Progress & Performance Records management system for Flight Training Organisations. Allows admins to browse students and instructors, create and manage performance evaluations (EPRs), and generate AI-assisted remarks.

## What's Implemented

**Level 1 — Core EPR App (Complete)**
- PostgreSQL database with users, courses, enrollments, and epr_records tables
- Migration and seed scripts
- REST API for people directory and EPR CRUD operations
- Single-page React UI with People Directory and EPR Detail/Editor

**Level 2 — Option C: AI Assistant Stub (Complete)**
- Rule-based suggested remarks generation via `POST /api/epr/assist`
- "Generate Suggested Remarks" button in both Create and Edit EPR modals

## Project Structure

```
Airman-Academy/
├── client/                          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateEPRModal.tsx   # Modal for creating new EPRs
│   │   │   └── EPRModal.tsx         # Modal for viewing/editing EPRs
│   │   ├── services/
│   │   │   └── api.ts               # All API call functions
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Main app — People Directory UI
│   │   └── main.tsx                 # React entry point
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── server/                          # Node.js + Express backend
    ├── src/
    │   ├── controllers/
    │   │   ├── epr.controller.ts    # EPR route handlers
    │   │   └── people.controller.ts # People route handlers
    │   ├── services/
    │   │   ├── epr.service.ts       # EPR business logic + AI assist
    │   │   └── people.service.ts    # People query logic
    │   ├── db/
    │   │   ├── config.ts            # Knex database connection
    │   │   ├── migrations/
    │   │   │   ├── 001-create-tables.ts  # Creates all tables
    │   │   │   └── run-migrations.ts     # Migration runner
    │   │   └── seeds/
    │   │       └── seed.ts               # Seed data
    │   ├── routes/
    │   │   └── index.ts             # All API route definitions
    │   ├── types/
    │   │   └── index.ts             # TypeScript interfaces
    │   └── index.ts                 # Express app entry point
    ├── knexfile.js
    ├── .env                         # Environment variables
    └── package.json
```

## Prerequisites
- Node.js v18 or higher
- PostgreSQL installed and running
- A PostgreSQL database named `airman_db` (or update `.env` with your own)

## Setup & Running

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd Airman-Academy
```

**2. Install backend dependencies**
```bash
cd server
npm install
```

**3. Run migrations** (creates the database tables)
```bash
npm run migrate
```

**4. Seed the database** (inserts sample data)
```bash
npm run seed
```
This inserts: 3 instructors, 8 students, 3 courses (PPL, CPL Integrated, ATPL), enrollments, and sample EPR records.

**5. Start the backend server**
```bash
npm run dev
```
The backend will start on `http://localhost:5000`.

**6. Install frontend dependencies** (new terminal)
```bash
cd ../client
npm install
```

**7. Start the frontend**
```bash
npm run dev
```
The frontend will start on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/people` | List all people. Query params: `role` (student/instructor), `search` (name or email) |
| GET | `/api/people/:id` | Get a single person by ID |
| GET | `/api/epr?personId=:id` | Get all EPRs for a person, ordered by period start descending |
| GET | `/api/epr/:id` | Get a single EPR by ID |
| POST | `/api/epr` | Create a new EPR |
| PATCH | `/api/epr/:id` | Update an existing EPR (ratings, remarks, status) |
| POST | `/api/epr/assist` | Generate suggested remarks based on ratings (AI Assistant stub) |

**POST `/api/epr` — Body**
```json
{
  "personId": "uuid",
  "evaluatorId": "uuid",
  "roleType": "student",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-04-01",
  "overallRating": 4,
  "technicalSkillsRating": 4,
  "nonTechnicalSkillsRating": 3,
  "remarks": "Performance remarks here",
  "status": "draft"
}
```

**PATCH `/api/epr/:id` — Body** (all fields optional)
```json
{
  "overallRating": 5,
  "technicalSkillsRating": 4,
  "nonTechnicalSkillsRating": 4,
  "remarks": "Updated remarks",
  "status": "submitted"
}
```

**POST `/api/epr/assist` — Body**
```json
{
  "overallRating": 3,
  "technicalSkillsRating": 4,
  "nonTechnicalSkillsRating": 2
}
```
**Response:**
```json
{
  "suggestedRemarks": "The individual demonstrates strong technical fundamentals..."
}
```

## AI Assistant Stub

`POST /api/epr/assist` accepts three ratings (1–5) and returns rule-based suggested remarks:
- **Technical:** 4–5 (strong fundamentals), 3 (adequate), 1–2 (needs improvement)
- **Non-Technical:** 4–5 (excels in CRM), 3 (satisfactory), 1–2 (needs improvement)
- **Closing:** Based on average rating

On the frontend, a purple "✨ Generate Suggested Remarks" button appears in both the Create EPR and Edit EPR modals. Clicking it calls the endpoint and automatically fills the remarks textarea.

## Database Schema

**users**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, auto-generated |
| name | VARCHAR | Required |
| email | VARCHAR | Required, unique |
| role | VARCHAR | student, instructor, or admin |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

**courses**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR | e.g. "Private Pilot License (PPL)" |
| license_type | VARCHAR | e.g. "PPL", "CPL", "ATPL" |
| total_required_hours | NUMERIC | Required flight hours |

**enrollments**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| student_id | UUID | FK → users.id |
| course_id | UUID | FK → courses.id |
| start_date | DATE | Enrollment start |
| status | VARCHAR | active, completed, or dropped |

**epr_records**
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| person_id | UUID | FK → users.id (person being evaluated) |
| evaluator_id | UUID | FK → users.id (who wrote the EPR) |
| role_type | VARCHAR | student or instructor |
| period_start | DATE | Evaluation period start |
| period_end | DATE | Evaluation period end |
| overall_rating | INTEGER | 1–5 |
| technical_skills_rating | INTEGER | 1–5 |
| non_technical_skills_rating | INTEGER | 1–5 |
| remarks | TEXT | Written feedback |
| status | VARCHAR | draft, submitted, or archived |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

## AI Usage
ChatGPT and Claude assisted with boilerplate scaffolding, migrations, API structure, debugging, AI stub logic, and this README. All code was manually reviewed and tested.
