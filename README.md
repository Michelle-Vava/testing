# Automotive Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, full-stack automotive services marketplace that seamlessly connects vehicle owners with trusted service providers. Built with cutting-edge technologies to deliver a smooth, real-time experience for managing vehicle maintenance and repairs.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## 🚗 About

The Automotive Marketplace is a comprehensive platform designed to streamline the connection between vehicle owners seeking maintenance services and professional service providers. The platform features:

- **For Vehicle Owners**: Easy vehicle management, service request submission, quote comparison, and job tracking
- **For Service Providers**: Browse service requests, submit competitive quotes, manage jobs, and handle payments
- **Secure & Scalable**: Built on modern cloud infrastructure with enterprise-grade authentication

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - Integration with Clerk for robust user authentication and session management
- 👥 **Role-Based Access Control** - Distinct experiences for Vehicle Owners and Service Providers
- 🚙 **Vehicle Management** - Comprehensive vehicle profile management with maintenance history
- 📝 **Service Requests** - Create detailed service requests with urgency levels and descriptions
- 💰 **Quote System** - Service providers can submit, and owners can compare competitive quotes
- 📊 **Job Management** - Track job status from acceptance through completion
- 💳 **Payment Integration** - Secure payment processing via Stripe
- 🔔 **Real-time Updates** - WebSocket-based notifications for instant status updates
- 📧 **Email Notifications** - Automated email updates using Resend
- 📱 **Responsive Design** - Mobile-first UI that works seamlessly across all devices

### Technical Features
- 🎯 **Type Safety** - Full TypeScript implementation across frontend and backend
- 🔄 **Real-time Communication** - Socket.IO integration for live updates
- 📸 **Media Management** - Cloudinary integration for image uploads
- 🔍 **API Documentation** - Comprehensive Swagger/OpenAPI documentation
- 🛡️ **Security** - Helmet.js, rate limiting, input validation, and CORS protection
- 📊 **Logging** - Structured logging with Pino for observability
- 🧪 **Testing** - Jest (backend) and Vitest (frontend) test suites

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: TanStack Router
- **State Management**: 
  - TanStack Query for server state
  - Zustand for client state
- **Styling**: 
  - TailwindCSS
  - Shadcn UI components
  - Framer Motion for animations
- **Authentication**: Clerk React
- **Form Handling**: React Hook Form with Zod validation
- **API Client**: Axios with Orval-generated types
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk Backend SDK
- **Payment Processing**: Stripe
- **File Storage**: Cloudinary
- **Email Service**: Resend
- **Real-time**: Socket.IO
- **API Documentation**: Swagger/OpenAPI with Scalar
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, Throttler, JWT
- **Logging**: Pino
- **Testing**: Jest + Supertest

### DevOps & Tools
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm
- **Version Control**: Git
- **API Generation**: Orval (OpenAPI to TypeScript)

## 📁 Project Structure

This monorepo contains two main applications:

```
testing/
├── backend/              # NestJS API server
│   ├── src/             # Source code
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   ├── vehicles/    # Vehicle management
│   │   ├── requests/    # Service requests
│   │   ├── quotes/      # Quote management
│   │   ├── jobs/        # Job tracking
│   │   └── payments/    # Payment processing
│   ├── prisma/          # Database schema & migrations
│   └── test/            # E2E tests
│
├── frontend/            # React application
│   ├── src/            # Source code
│   │   ├── routes/     # Route definitions
│   │   ├── components/ # Reusable components
│   │   ├── lib/        # Utilities & API client
│   │   └── hooks/      # Custom React hooks
│   └── public/         # Static assets
│
└── docker-compose.yml  # Docker orchestration
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v15 recommended) - [Download](https://www.postgresql.org/download/)
- **Docker & Docker Compose** (optional, for containerized setup) - [Download](https://www.docker.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Michelle-Vava/testing.git
   cd testing
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@localhost:5432/shanda_db"

# Server
PORT=4201
NODE_ENV=development

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Supabase (if using)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

See `backend/.env.example` for a complete template.

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API
VITE_API_URL=http://localhost:4201

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

See `frontend/.env.example` for a complete template.

### Database Setup

1. **Create the database**
   ```bash
   createdb shanda_db
   ```
   Or use your PostgreSQL client of choice.

2. **Run migrations**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

3. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

4. **Open Prisma Studio (optional)**
   ```bash
   npm run prisma:studio
   ```
   Access the database GUI at `http://localhost:5555`

### Running the Application

#### Development Mode

**Option 1: Run services separately**

1. **Start the backend server**
   ```bash
   cd backend
   npm run start:dev
   ```
   The API will be available at `http://localhost:4201`

2. **In a new terminal, start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

**Option 2: Use Docker Compose (recommended)**
   ```bash
   docker-compose up
   ```
   - Frontend: `http://localhost:8080`
   - Backend: `http://localhost:3000` (Note: runs on different port than dev mode)
   - PostgreSQL: `localhost:5432`
   
   > **Note**: When using Docker Compose, the backend runs on port 3000 (as defined in docker-compose.yml), whereas in local development mode it runs on port 4201 (as defined in .env).

#### Production Mode

1. **Build the backend**
   ```bash
   cd backend
   npm run build
   npm run start:prod
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## 🐳 Docker Deployment

The project includes Docker support for easy deployment.

### Using Docker Compose

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

5. **Reset everything (including volumes)**
   ```bash
   docker-compose down -v
   ```

### Individual Service Deployment

**Backend:**
```bash
cd backend
docker build -t automotive-backend .
docker run -p 3000:3000 automotive-backend
```

**Frontend:**
```bash
cd frontend
docker build -t automotive-frontend .
docker run -p 8080:80 automotive-frontend
```

## 📚 API Documentation

The backend API is fully documented using OpenAPI/Swagger.

### Accessing the Documentation

When the backend is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:4201/api`
- **Scalar UI**: `http://localhost:4201/reference` (modern alternative)

### API Endpoints

Key endpoint categories:
- `/shanda/auth` - Authentication (signup, login, session)
- `/shanda/users` - User management
- `/shanda/vehicles` - Vehicle CRUD operations
- `/shanda/requests` - Service request management
- `/shanda/quotes` - Quote submission and management
- `/shanda/jobs` - Job tracking and status updates
- `/shanda/payments` - Payment processing

### Generating TypeScript Client

The frontend uses Orval to generate a type-safe API client from the OpenAPI spec:

```bash
cd frontend
npm run generate:api
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test -- --ui

# Run tests with coverage
npm test -- --coverage
```

## 📜 Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run prisma:studio` | Open Prisma Studio |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint the codebase |
| `npm test` | Run tests |
| `npm run type-check` | Check TypeScript types |
| `npm run validate` | Run type-check and lint |
| `npm run generate:api` | Generate API client from OpenAPI spec |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Built with ❤️ for the automotive community**
