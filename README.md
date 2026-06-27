# ProjectPortal

**Final Year Project Allotment System**

A full-stack web application that helps colleges manage final-year project topic allocation between student teams and faculty guides. Teams browse available topics, select a project once, and maintain member details — while faculty create topics, manage availability, and monitor assignments.

---

## Project Abstract

Final-year engineering and degree students are typically required to complete a capstone project under faculty supervision. Coordinating topic selection across multiple teams, preventing duplicate allocations, and keeping faculty informed of assignments is often handled manually through spreadsheets or email — leading to conflicts, delays, and poor visibility.

**ProjectPortal** addresses this problem by providing a centralized, role-based platform for project allotment. The system supports two user roles:

- **Student Teams** — Log in with a Team ID, view available project topics filtered by domain and difficulty, select one project (locked after selection), and maintain individual member details (name, roll number, department, year, semester, section) for each student in the team.
- **Faculty** — Log in with a Faculty ID, create and manage project topics, view all team allocations, and monitor dashboard statistics such as total topics, available slots, and allocation counts.

The application uses a **React + TypeScript** frontend and a **Node.js + Express REST API** backend with **PostgreSQL** for persistent storage. This architecture supports real data persistence, transactional project allocation, and a clear separation between client and server.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| TypeScript 5 | Static typing |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | Styling (light/dark mode) |
| Lucide React | Icons |
| Vite 5 | Dev server & build tool |
| React Context API | Auth, theme, notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 4 | REST API server |
| TypeScript 5 | Server-side typing |
| pg (node-postgres) | PostgreSQL client |
| cors | Cross-origin requests |
| dotenv | Environment configuration |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL 15+ | Relational data storage |

---

## Architecture

```
┌─────────────────┐     REST API (JSON)     ┌─────────────────┐     SQL      ┌──────────────┐
│  React Frontend │  ◄──────────────────►  │  Express Server │  ◄────────►  │  PostgreSQL  │
│  (Vite :5173)   │      /api/*            │  (Node :3001)   │              │              │
└─────────────────┘                        └─────────────────┘              └──────────────┘
```

---

## Project Structure

```
project/
├── src/                    # React frontend
│   ├── lib/api.ts          # REST API client
│   ├── context/            # Auth, theme, notifications
│   ├── pages/              # Route pages
│   └── components/         # UI components
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── index.ts        # Express app entry
│   │   ├── db/             # Schema, setup, seed
│   │   ├── routes/         # REST route handlers
│   │   └── middleware/     # Error handling
│   └── package.json
├── package.json            # Frontend dependencies
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (running locally)

### 1. Create the database

```bash
createdb projectportal
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
# Edit .env if your PostgreSQL credentials differ

npm install
npm run db:setup    # Create tables
npm run db:seed     # Insert demo data
npm run dev         # Start API on http://localhost:3001
```

Default `DATABASE_URL`:
```
postgresql://postgres:postgres@localhost:5432/projectportal
```

### 3. Start the frontend (new terminal)

```bash
cd ..   # project root
npm install
npm run dev   # Start on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend automatically.

---

## REST API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/faculty/login` | Faculty login |
| POST | `/api/auth/team/login` | Team login |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/allocated-ids` | List allocated project IDs |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List all teams |
| GET | `/api/teams/:id` | Get team by ID |
| PATCH | `/api/teams/:id` | Update team / member details |

### Allocations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/allocations` | List allocations |
| GET | `/api/allocations/details` | Allocations with team & project |
| POST | `/api/allocations` | Create allocation (transactional) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## Demo Credentials

| Role | ID | Password |
|------|-----|----------|
| Team | `27A01` | `2116231001001` |
| Team | `27A02` | `2116231001002` |
| Faculty | `FAC001` | `faculty123` |
| Faculty | `FAC002` | `faculty123` |

Seed data includes **32 teams**, **4 faculty members**, and **14 sample project topics**.

---

## Application Routes

### Public
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login/team` | Team login |
| `/login/faculty` | Faculty login |

### Student (Team)
| Route | Page |
|-------|------|
| `/student/dashboard` | Team dashboard |
| `/student/topics` | Browse and select projects |
| `/student/my-project` | Selected project details |
| `/student/profile` | Team profile |

### Faculty
| Route | Page |
|-------|------|
| `/faculty/dashboard` | Faculty dashboard |
| `/faculty/topics` | Manage project topics |
| `/faculty/topics/new` | Add new topic |
| `/faculty/topics/edit/:id` | Edit topic |
| `/faculty/allocations` | View allocations |
| `/faculty/profile` | Faculty profile |

---

## Database Schema

| Table | Description |
|-------|-------------|
| `faculty` | Faculty accounts and credentials |
| `teams` | Team accounts, member profiles, selected project |
| `projects` | Project topics with domain and difficulty |
| `allocations` | Team–project assignment records |

---

## Available Scripts

### Frontend (project root)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

### Backend (`server/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled server |
| `npm run db:setup` | Apply database schema |
| `npm run db:seed` | Seed demo data |

---

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=/api
```

### Backend (`server/.env`)
```
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/projectportal
CORS_ORIGIN=http://localhost:5173
```

---

## License

This project is private and intended for educational use.
