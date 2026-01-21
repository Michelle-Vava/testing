# Automotive Marketplace

A modern automotive services marketplace connecting vehicle owners with service providers.

## Project Structure

This monorepo consists of two main applications:

- **Frontend**: A React application built with Vite, TailwindCSS, and TanStack Query.
- **Backend**: A NestJS API using PrismaORM and PostgreSQL.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional, for running infrastructure)

### Installation

1. Clone the repository
2. Install dependencies for both projects:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Development

Start the development servers:

**Backend:**
```bash
cd backend
# Set up environment variables first
npm run prisma:migrate
npm run start:dev
```
The API will be available at `http://localhost:4201`.

**Frontend:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

## Features

- **Authentication**: Secure authentication via Clerk.
- **Role-Based Access**: Specialized dashboards for Vehicle Owners and Service Providers.
- **Service Requests**: Owners can post requests for vehicle maintenance.
- **Quotes**: Providers can submit quotes for open requests.
- **Real-time Updates**: Status updates and messaging.

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- TanStack Router
- TanStack Query
- TailwindCSS
- Shadcn UI
- Clerk (Auth)

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger API Documentation
