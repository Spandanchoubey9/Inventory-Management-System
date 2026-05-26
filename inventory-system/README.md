# Inventory System

## one-time setup

cd backend && npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts

cd ../frontend && npm install

## to run (two terminals)

# terminal 1:
cd backend && npm run dev

# terminal 2:
cd frontend && npm run dev

---

This project uses a SQLite database in `backend/prisma/dev.db`.
Prisma generates the client before any Prisma import works.

**Note:** SQLite does not provide a native JSON type, so audit log old/new values are stored as JSON strings and parsed when needed.

## Roles and access

- `ADMIN` has full rights across all modules.
- `STAFF` has limited access and cannot use admin-only actions/routes.
- Seed users are in `backend/prisma/seed.ts` (including an admin account).
- The app now includes a top-right `Sign out` button to end session cleanly.

## Vercel deployment (adjustable)

Deploy frontend and backend as two separate Vercel projects.

### Frontend (`inventory-system/frontend`)

- Build command: `npm run build`
- Output directory: `dist`
- Set env var: `VITE_API_URL=https://<your-backend-domain>`
- `frontend/vercel.json` already includes SPA rewrites.

### Backend (`inventory-system/backend`)

- Uses `backend/api/index.ts` as the Vercel serverless entry.
- `backend/vercel.json` rewrites requests to that entry.
- Set these environment variables in Vercel:
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_EXPIRY`
  - `JWT_REFRESH_EXPIRY`
  - `BCRYPT_ROUNDS`
  - `NODE_ENV=production`
  - `PORT=3000`
  - `LOG_LEVEL`
  - `CORS_ORIGIN` (comma-separated, include your frontend Vercel URL)
  - `GOOGLE_CLIENT_ID` (optional)

Use `backend/.env.example` and `frontend/.env.example` as templates.
