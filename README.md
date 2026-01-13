# CRM Dashboard

A complete, production-ready CRM Dashboard built with Next.js, TypeScript, Prisma, and PostgreSQL.

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
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (for production) or use Vercel Postgres (recommended)
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
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/crm?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

For local development, you can use:
- Local PostgreSQL instance
- Docker PostgreSQL container
- Free PostgreSQL services like Supabase, Neon, or Railway

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

## Deployment to Vercel

This project is configured for easy deployment to Vercel with PostgreSQL.

### Quick Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Set up Vercel Postgres (Recommended)**
   - In your Vercel project dashboard, go to the "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Vercel will automatically add the `POSTGRES_URL` environment variable

4. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:
   - `DATABASE_URL`: Use the `POSTGRES_URL` from Vercel Postgres (automatically set if you use Vercel Postgres)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`

5. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - The build process will:
     - Run `postinstall` script to generate Prisma Client
     - Build your Next.js application

6. **Set up the database**
   After deployment, run migrations and seed the database:
   ```bash
   # Using Vercel CLI (install: npm i -g vercel)
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed
   ```

### Alternative: Using External PostgreSQL

If you prefer to use an external PostgreSQL database (Supabase, Railway, etc.):

1. Set up your PostgreSQL database
2. Get the connection string
3. Add `DATABASE_URL` to Vercel environment variables
4. Deploy and run migrations as above

### Post-Deployment

- Run database migrations: `npx prisma db push` (or use `prisma migrate deploy` for production)
- Seed initial data: `npx prisma db seed`
- Your app will be available at `https://your-app.vercel.app`

**Note:** The project is configured with `postinstall` script to automatically generate Prisma Client during Vercel builds.

## License

This project is open source and available under the MIT License.

