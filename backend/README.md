# TaskHub Backend

NestJS API for the TaskHub task manager, structured as a **modular monolith**:
one deployable app, internally split into modules with clear boundaries.

## Modules

- **`users`** — owns the `User` schema and DB access. Exports `UsersService` for other modules to use.
- **`auth`** — registration/login, password hashing (bcrypt), JWT issuing. Depends on `users`.
- **`tasks`** — task CRUD, scoped to the authenticated user (ownership checked in the service layer, not just the controller). Depends on `notifications`.
- **`notifications`** — in-memory per-user notification log, triggered when a task is created or marked done. Deliberately isolated behind a service interface so it can be swapped for real email/push later without touching `tasks`.

Modules only talk to each other through exported providers (see each module's `exports` array) — never by reaching into another module's internals directly. That's the discipline that makes a future split into separate services easier, if you ever need it.

## Running locally

Requires Node 20+ and a MongoDB instance reachable from your machine (local install, or a container you run yourself).

```bash
npm install
cp .env.example .env   # then edit MONGO_URI and JWT_SECRET
npm run start:dev
```

Runs on `http://localhost:4000` by default, with all routes under `/api` (e.g. `/api/auth/login`, `/api/tasks`) — set by `app.setGlobalPrefix('api')` in `main.ts`.

## Environment variables

See `.env.example`:
- `MONGO_URI` — your Mongo connection string
- `JWT_SECRET` — used to sign auth tokens; generate a real one for anything beyond local testing (`openssl rand -base64 48`)
- `PORT` — defaults to 4000

## API surface

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | no | Create account, returns JWT |
| POST | `/api/auth/login` | no | Returns JWT |
| GET | `/api/tasks` | yes | List current user's tasks |
| POST | `/api/tasks` | yes | Create a task |
| GET | `/api/tasks/:id` | yes | Get one task (must be owner) |
| PATCH | `/api/tasks/:id` | yes | Update a task (must be owner) |
| DELETE | `/api/tasks/:id` | yes | Delete a task (must be owner) |
| GET | `/api/notifications` | yes | List current user's notifications |

Authenticated routes expect `Authorization: Bearer <token>`.

## Not included on purpose

No Dockerfile, no deployment config — that part's yours to build.
