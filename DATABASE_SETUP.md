# Free Database Setup Guide

## Quick Options (Recommended)

### Option 1: Supabase (Easiest - Recommended)
**Free Tier:** 500MB database, unlimited API requests

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest)
4. Click "New Project"
5. Fill in:
   - Project name: `crm-dashboard`
   - Database password: (create a strong password - save it!)
   - Region: Choose closest to you
6. Wait 2-3 minutes for database to be created
7. Go to Settings → Database
8. Copy the "Connection string" under "Connection pooling" (recommended) or "URI"
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Option 2: Neon (Serverless PostgreSQL)
**Free Tier:** 0.5GB storage, unlimited projects

1. Go to https://neon.tech
2. Click "Sign Up" (GitHub login available)
3. Click "Create a project"
4. Fill in:
   - Project name: `crm-dashboard`
   - Region: Choose closest
5. Click "Create project"
6. Copy the connection string from the dashboard
   - Format: `postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require`

### Option 3: Vercel Postgres (Integrated)
**Free Tier:** 256MB storage, 60 hours compute/month

1. Go to your Vercel dashboard
2. Go to Storage tab
3. Click "Create Database" → "Postgres"
4. Click "Create"
5. Connection string is automatically added to your environment variables
6. Copy it from Settings → Environment Variables

### Option 4: Railway
**Free Tier:** $5 credit/month (usually enough for small apps)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Click "Provision PostgreSQL"
5. Click on the PostgreSQL service
6. Go to "Variables" tab
7. Copy the `DATABASE_URL`

## After Getting Your Database

1. **Update your `.env` file locally:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

2. **Update Prisma schema** (if not already done):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Push schema to database:**
```bash
npx prisma db push
```

4. **Seed database (optional):**
```bash
npm run db:seed
```

## Recommendation

**For Vercel deployment:** Use **Supabase** or **Neon** - both are:
- Free
- Easy to set up
- Work great with Vercel
- Have good free tiers
- Provide connection pooling

**For easiest integration:** Use **Vercel Postgres** if you're deploying on Vercel - it's automatically configured.




