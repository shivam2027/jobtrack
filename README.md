# JobTrack — Full-Stack Job Application Tracker

A full-stack web app for tracking job applications: company, role, status,
salary, and notes, with a live dashboard of application stats. Built to
demonstrate a complete, production-shaped full-stack workflow: REST API,
authentication, relational data, and a modern React frontend.

## Tech Stack

**Frontend**
- React 18 (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- SQLite (via `better-sqlite3`) — zero-config relational database
- JWT authentication
- bcrypt password hashing
- express-validator for request validation

## Features

- User registration & login with JWT-based auth
- Create, read, update, and delete job applications
- Filter by status (applied / interviewing / offer / rejected / withdrawn) and search by company/role
- Live dashboard stats (totals per status)
- Per-user data isolation (each user only sees their own applications)
- Responsive UI

## Project Structure

```
jobtrack/
├── server/                  # Express API
│   ├── db/
│   │   └── database.js      # SQLite connection + schema
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # /api/auth/*
│   │   └── applications.js  # /api/applications/*
│   ├── index.js             # App entry point
│   └── package.json
│
└── client/                  # React (Vite) frontend
    ├── src/
    │   ├── api/axios.js         # Axios instance with auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone <your-repo-url>
cd jobtrack

# Install backend dependencies
cd server
npm install
cp .env.example .env   # then set a real JWT_SECRET

# Install frontend dependencies
cd ../client
npm install
```

### 2. Run the backend

```bash
cd server
npm run dev   # http://localhost:5000
```

The SQLite database file is created automatically on first run — no
external database setup needed.

### 3. Run the frontend

In a second terminal:

```bash
cd client
npm run dev   # http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`,
so the app works out of the box.

### 4. Open the app

Visit `http://localhost:5173`, create an account, and start tracking
applications.

## API Overview

| Method | Endpoint                  | Description                     | Auth |
|--------|----------------------------|----------------------------------|------|
| POST   | `/api/auth/register`       | Create a new account             | No   |
| POST   | `/api/auth/login`          | Log in and receive a JWT         | No   |
| GET    | `/api/auth/me`              | Get current user profile         | Yes  |
| GET    | `/api/applications`         | List applications (filter/search)| Yes  |
| GET    | `/api/applications/stats`   | Application counts by status     | Yes  |
| POST   | `/api/applications`         | Create an application            | Yes  |
| PUT    | `/api/applications/:id`     | Update an application            | Yes  |
| DELETE | `/api/applications/:id`     | Delete an application             | Yes  |

## Deployment Notes

- **Backend**: deploy to Render, Railway, or Fly.io. Set `JWT_SECRET` and
  `PORT` as environment variables. The SQLite file works fine for a small
  deployment; swap in Postgres for production scale.
- **Frontend**: build with `npm run build` in `client/` and deploy the
  `dist/` folder to Vercel, Netlify, or any static host. Update the API
  base URL (or proxy config) to point at your deployed backend.

## Possible Extensions

- Kanban-style drag-and-drop board for statuses
- Email reminders for follow-ups
- File uploads for resumes/cover letters per application
- Analytics charts (response rate, time-to-offer)
