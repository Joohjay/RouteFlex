# JJ Transport

A production-ready full-stack logistics and transport management platform built for modern transport companies. Designed to be future-ready for multi-tenant SaaS expansion.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Framer Motion, React Hook Form, Zod
- **Backend:** Node.js, Express.js, TypeScript, Prisma, PostgreSQL
- **Auth:** JWT + bcryptjs
- **Media:** Cloudinary
- **Email:** Nodemailer
- **Maps:** Google Maps API (ready for integration)

## Features

- Public website with Home, About, Services, Fleet, Gallery, Booking, Contact, FAQ, Careers, and Blog
- Online booking with real-time smart quote estimation
- WhatsApp integration for instant booking confirmation
- Shipment tracking by reference number
- Admin dashboard with analytics and all management modules
- Fleet, service, gallery, blog, testimonial, and user management
- Role-based authentication (Admin, Manager, Dispatcher, Driver, Viewer)
- Company-aware, multi-tenant-ready architecture

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or cloud)
- npm 10+

## Development Setup

```bash
# Clone and install dependencies
npm install --legacy-peer-deps

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Set up PostgreSQL and update DATABASE_URL in backend/.env

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development servers
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Default Admin

After seeding, log in with:

- Email: `admin@jjtransport.com`
- Password: `Admin@123` (change in production)

## Scripts

```bash
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build both workspaces
npm run test             # Run all tests
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed the database
npm run db:studio        # Open Prisma Studio
```

## API Documentation

See [docs/api.md](docs/api.md) for full endpoint reference.

## Production Deployment

### Frontend (Vercel)

1. Connect the repository to Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL` environment variable pointing to your backend.
4. Deploy.

### Backend (Render / Railway)

1. Set the root directory to `backend`.
2. Add all environment variables from `backend/.env.example`.
3. Build command: `npm run build`
4. Start command: `npm start`
5. Ensure `DATABASE_URL` points to a PostgreSQL cloud instance.

### Database

Run migrations in production:

```bash
npm run db:migrate:prod
```

## Architecture

The application is organized as a monorepo with a clear separation between frontend and backend. The backend is built around modular domain services, centralized error handling, and a company-scoped data model that allows future expansion into a multi-company SaaS platform.

## License

UNLICENSED - Private and confidential.
