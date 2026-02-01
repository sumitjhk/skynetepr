Skynet EPR — AIRMAN Academy
Electronic Progress & Performance Records management system for Flight Training Organisations. Allows admins to browse students and instructors, create and manage performance evaluations (EPRs), and generate AI-assisted remarks.

What is Implemented

Level 1 — Core EPR App (Complete)

PostgreSQL database with users, courses, enrollments, and epr_records tables
Migration and seed scripts
REST API for people directory and EPR CRUD operations
Single-page React UI with People Directory and EPR Detail/Editor


Level 2 — Option C: AI Assistant Stub (Complete)

Rule-based suggested remarks generation via POST /api/epr/assist
"Generate Suggested Remarks" button in both Create and Edit EPR modals


Project Structure


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




Prerequisites
Node.js v18 or higher
PostgreSQL installed and running
A PostgreSQL database named airman_db (or update .env with your own)

Setup & Running
1. Clone the repository
bash
git clone <your-repo-url>
cd Airman-Academy
2. Configure the backend environment
Open server/.env and update your database credentials:
envPORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=airman_db
DB_USER=postgres
DB_PASSWORD=your_password_here
3. Install backend dependencies
bash
cd server
npm install
4. Run migrations (creates the database tables)
bashnpm run migrate
5. Seed the database (inserts sample data)
bashnpm run seed
This inserts:

3 instructors
8 students
3 courses (PPL, CPL Integrated, ATPL)
Enrollments linking students to courses
Several EPR records for testing

6. Start the backend server
bashnpm run dev
The backend will start on http://localhost:5000.
7. Install frontend dependencies (new terminal)
bashcd ../client
npm install
8. Start the frontend
bashnpm run dev
The frontend will start on http://localhost:3000.

API Endpoints
MethodEndpointDescriptionGET/api/peopleList all people. Query params: role (student/instructor), search (name or email)GET/api/people/:idGet a single person by IDGET/api/epr?personId=:idGet all EPRs for a person, ordered by period start descendingGET/api/epr/:idGet a single EPR by IDPOST/api/eprCreate a new EPRPATCH/api/epr/:idUpdate an existing EPR (ratings, remarks, status)POST/api/epr/assistGenerate suggested remarks based on ratings (AI Assistant stub)
POST /api/epr — Body
json{
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
PATCH /api/epr/:id — Body (all fields optional)
json{
  "overallRating": 5,
  "technicalSkillsRating": 4,
  "nonTechnicalSkillsRating": 4,
  "remarks": "Updated remarks",
  "status": "submitted"
}
POST /api/epr/assist — Body
json{
  "overallRating": 3,
  "technicalSkillsRating": 4,
  "nonTechnicalSkillsRating": 2
}
Response:
json{
  "suggestedRemarks": "The individual demonstrates strong technical fundamentals..."
}

Level 2 — AI Assistant Stub
The POST /api/epr/assist endpoint generates suggested remarks using simple rule-based logic — no external LLM is needed.
How it works:
The service evaluates each rating independently and combines them into a full remark:

Technical Skills Rating:

4–5 → Strong technical fundamentals
3 → Adequate but needs more review time
1–2 → Needs significant improvement


Non-Technical Skills Rating:

4–5 → Excels in CRM and communication
3 → Satisfactory but needs to improve checklist discipline
1–2 → Requires improvement in CRM and communication


Closing Statement (based on the average of all 3 ratings):

Average ≥ 4 → Commendable performance
Average ≥ 3 → Satisfactory, continued effort encouraged
Average < 3 → Below expectations, improvement plan recommended



On the frontend, a purple "✨ Generate Suggested Remarks" button appears in both the Create EPR and Edit EPR modals. Clicking it calls the endpoint and automatically fills the remarks textarea.

Database Schema
users
ColumnTypeNotesidUUIDPrimary key, auto-generatednameVARCHARRequiredemailVARCHARRequired, uniqueroleVARCHARstudent, instructor, or admincreated_atTIMESTAMPAuto-setupdated_atTIMESTAMPAuto-set
courses
ColumnTypeNotesidUUIDPrimary keynameVARCHARe.g. "Private Pilot License (PPL)"license_typeVARCHARe.g. "PPL", "CPL", "ATPL"total_required_hoursNUMERICRequired flight hours
enrollments
ColumnTypeNotesidUUIDPrimary keystudent_idUUIDFK → users.idcourse_idUUIDFK → courses.idstart_dateDATEEnrollment startstatusVARCHARactive, completed, or dropped
epr_records
ColumnTypeNotesidUUIDPrimary keyperson_idUUIDFK → users.id (person being evaluated)evaluator_idUUIDFK → users.id (who wrote the EPR)role_typeVARCHARstudent or instructorperiod_startDATEEvaluation period startperiod_endDATEEvaluation period endoverall_ratingINTEGER1–5technical_skills_ratingINTEGER1–5non_technical_skills_ratingINTEGER1–5remarksTEXTWritten feedbackstatusVARCHARdraft, submitted, or archivedcreated_atTIMESTAMPAuto-setupdated_atTIMESTAMPAuto-set

How I Used AI in This Project
AI tools (ChatGPT, Claude) were used for the following:

Scaffolding boilerplate code — Express server setup, React component structure, Knex configuration
Generating migration and seed scripts — SQL table creation and sample data insertion
Drafting API route structure — Mapping out the REST endpoints based on the assessment requirements
Debugging TypeScript issues — Resolving verbatimModuleSyntax import errors and Vite configuration problems
Implementing the AI Assistant stub — Designing the rule-based logic for generating suggested EPR remarks
Writing this README — Structuring documentation based on the actual project files

All generated code was reviewed, understood, and tested manually before being included in the final project.
