# CRM Dashboard

A complete, production-ready CRM Dashboard built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- **Authentication**: Secure login/signup with NextAuth
- **Role-Based Access**: Admin, Manager, and Sales roles
- **Lead Management**: Full CRUD operations with filtering and search
- **Customer Management**: Convert leads to customers and track relationships
- **Deal Pipeline**: Kanban-style pipeline view for managing deals
- **Task Management**: Create and track tasks with due dates
- **Activity Logging**: Track calls, emails, meetings, and notes
- **Reports & Analytics**: Comprehensive reports with CSV export
- **User Management**: Admin panel for managing users and roles

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd CRM
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

**Note:** This project uses SQLite, so no database connection string is needed. The database file (`dev.db`) will be created automatically in the `prisma` directory.

For the `NEXTAUTH_SECRET`, you can generate one using:
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@crm.com` / `password123`
- **Manager**: `manager@crm.com` / `password123`
- **Sales**: `sales1@crm.com` / `password123`

## Project Structure

```
CRM/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   ├── leads/            # Lead management components
│   ├── customers/        # Customer management components
│   ├── deals/            # Deal management components
│   ├── tasks/            # Task management components
│   ├── activities/       # Activity components
│   ├── reports/          # Reports components
│   └── settings/         # Settings components
├── lib/                   # Utility functions
│   ├── actions/          # Server actions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/                # Prisma files
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles
- **Lead**: Potential customers
- **Customer**: Converted leads
- **Deal**: Sales opportunities
- **Task**: Task management
- **Activity**: Activity logs (calls, emails, meetings, notes)
- **Note**: Internal notes
- **Notification**: User notifications

## Features Overview

### Dashboard
- Overview cards with key metrics
- Charts for leads by status and monthly revenue
- Recent activity feed

### Leads Management
- Create, edit, delete leads
- Filter by status and source
- Search functionality
- Convert leads to customers

### Customer Management
- Full customer CRUD
- View customer history (deals, activities, notes)
- Link deals to customers

### Deal Pipeline
- Kanban-style pipeline view
- Track deals through stages: Prospect → Proposal → Negotiation → Won/Lost
- Drag-and-drop stage updates

### Tasks & Follow-ups
- Create tasks linked to leads/customers/deals
- Set due dates and assign to users
- Track task completion

### Activities
- Log calls, emails, meetings, and notes
- Link activities to leads/customers/deals
- Activity timeline view

### Reports & Analytics
- Sales performance by user
- Lead conversion rates
- Revenue reports
- Export to CSV

### Settings
- User management (Admin only)
- Role assignment
- User activation/deactivation

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based access control
- Protected API routes
- Input validation

## Deployment

For production deployment, you may want to switch to PostgreSQL or another database:

1. Update the `datasource` in `prisma/schema.prisma` to use PostgreSQL
2. Set up a PostgreSQL database (e.g., on Vercel Postgres, Supabase, or Railway)
3. Update `DATABASE_URL` in your environment variables
4. Update `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
5. Deploy to Vercel, Netlify, or your preferred hosting platform

**Note:** For local development, SQLite is used and requires no additional setup.

## License

This project is open source and available under the MIT License.

