# Shanda

Vehicle service marketplace. Owners post requests, providers send quotes, book services.

## Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Add your DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm run start:dev     # http://localhost:4201/shanda

# Frontend
cd frontend
npm install
cp .env.example .env  # Add VITE_API_URL=http://localhost:4201/shanda
npm run dev          # http://localhost:5173
```

## Stack

**Backend:** NestJS, Prisma, PostgreSQL, JWT, Stripe  
**Frontend:** React, TypeScript, TanStack Router/Query, Tailwind, Vite

## Features

- Auth (JWT, password reset)
- Vehicles (VIN auto-fill)
- Service requests & quotes
- Job tracking
- Payments (Stripe)
- Settings (profile, notifications, light/dark mode)
- Public pages (About, Contact, Help, Privacy, Terms)

## Docs

- API: http://localhost:4201/shanda/api (Swagger)
- [Email Setup](docs/EMAIL_SETUP.md)
- [Auth Options](docs/SUPABASE_AUTH_GUIDE.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)
