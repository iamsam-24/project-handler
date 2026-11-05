# Project2 Frontend — Client SaaS Management Console

A simple, fast, and intuitive frontend management interface designed for clients and administrators of Project2.

## Features & Navigation

1. **Sign In & Register (`/api/users/login`, `/api/users/register`)**:
   - Live backend health status check
   - Register new user accounts (default role: `ROLE_USER`)
   - Sign in with JWT Bearer session handling

2. **Overview / Dashboard**:
   - System metrics snapshot (Total Organisations, Projects, Tasks)
   - Task distribution cards (TODO, IN PROGRESS, DONE, FAILED)
   - Active Organisation and Project quick switcher
   - Diagnostic `GET /api/users/hello` trigger

3. **Organisations (`/api/organisation`)**:
   - List all organisations (`GET /api/organisation/getAll`)
   - Create organisation (`POST /api/organisation`, Admin only)
   - Lookup organisation by UUID (`GET /api/organisation/{id}`)
   - Delete organisation (`DELETE /api/organisation/{id}`, Admin only)
   - "Set as Active" one-click context binder

4. **Projects (`/api/project`)**:
   - List all projects with linked organisation badges (`GET /api/project/getAll`)
   - Create project under an organisation (`POST /api/project/{orgId}`, Admin only)
   - Lookup project by UUID (`GET /api/project/{id}`)
   - Delete project (`DELETE /api/project/{id}`, Admin only)
   - One-click shortcuts to project tasks and live project chat

5. **Tasks (`/api/task`)**:
   - Task directory with filtering by project, status, and priority (`GET /api/task/getAll`)
   - Create task (`POST /api/task/{projectId}`, Admin only)
   - Inline status switcher (`TODO` -> `IN_PROGRESS` -> `DONE` -> `FAILED`) using `PUT /api/task/{id}` (available to all authenticated users)
   - Edit task modal (`PUT /api/task/{id}`)
   - Delete task (`DELETE /api/task/{id}`, Admin only)

6. **Team & Roles (`/api/membership`, `/api/roles`, `/api/users`)**:
   - Add user to organisation (`POST /api/membership`, Admin only)
   - Lookup and remove memberships (`GET` / `DELETE /api/membership/{id}`, Admin only)
   - Register system roles (`POST /api/roles`, Admin only)
   - Permanently delete user accounts (`DELETE /api/users/{id}`, Admin only)

7. **Real-Time Project Chat (`/chat?projectId={UUID}`)**:
   - Full-duplex WebSocket project rooms
   - Connect, leave, and broadcast real-time messages to team members

8. **Backend Info & Live API Explorer**:
   - Complete directory of all 14+ backend endpoints with controller references and security rules
   - JWT Claims inspector (Subject, Issuer, Expiration, Granted Authorities)
   - Live Interactive API Playground to test any endpoint directly with custom payloads

## Getting Started

```powershell
cd Frontend
npm install
npm run dev
```

- Web UI: `http://localhost:5173`
- Backend API Proxy: `http://localhost:8080` (configured in `vite.config.ts`)
