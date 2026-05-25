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
