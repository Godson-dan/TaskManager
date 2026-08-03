# TaskHub Frontend

Vite + React + TypeScript client for the TaskHub task manager.

## Structure

- **`src/api/client.ts`** — thin fetch wrapper. Calls a **relative** path (`/api/...`), doesn't hardcode a backend host — whatever sits in front of this app (dev proxy, or your own reverse proxy in production) is responsible for routing `/api` to the backend.
- **`src/api/AuthContext.tsx`** — stores the JWT (`localStorage`) and current user, exposes `login()`/`logout()`, and `isAuthenticated`.
- **`src/pages/`** — `Login`, `Register`, `Tasks`.
- **`src/components/PipelineStepper.tsx`** — the status control on each task card (todo → in progress → done).
- **`src/App.tsx`** — routes, and a `RequireAuth` wrapper that redirects to `/login` if there's no token.

## Running locally

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. `vite.config.ts` proxies `/api` to `http://localhost:4000` in dev, so run the backend locally alongside it (see `backend/README.md`) and the two will talk to each other with no extra setup.

## Building for production

```bash
npm run build
```

Outputs static files to `dist/` — HTML/CSS/JS, no server included. Something needs to serve those files and route `/api` calls to wherever the backend ends up living; that's on you to set up (this is where your Nginx config or whatever else you choose comes in).

## Environment

No `.env` file needed for the frontend itself — since it only ever calls relative `/api/...` paths, there's no backend URL to configure here. Whatever serves this build decides where `/api` actually points.

## Not included on purpose

No Dockerfile, no Nginx config, no deployment setup — that part's yours to build.
