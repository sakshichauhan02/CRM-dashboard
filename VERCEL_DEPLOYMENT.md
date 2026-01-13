# Vercel Deployment Guide

This project is now configured for deployment on Vercel with PostgreSQL.

## Quick Steps to Deploy

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your repository: `sakshichauhan02/CRM-dashboard`

### 3. Set Up Database (Vercel Postgres - Recommended)

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Choose a name for your database
4. Vercel will automatically create and inject the `POSTGRES_URL` environment variable

**Important:** Vercel Postgres uses `POSTGRES_URL`, but Prisma expects `DATABASE_URL`. Add this environment variable:

- **Key**: `DATABASE_URL`
- **Value**: Copy the value from `POSTGRES_URL` (or use the same value)

### 4. Configure Environment Variables

In your Vercel project settings → Environment Variables, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `$POSTGRES_URL` or your PostgreSQL connection string | Database connection (use `$POSTGRES_URL` if using Vercel Postgres) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | Generated secret | Generate with: `openssl rand -base64 32` |

### 5. Deploy

Vercel will automatically:
- Install dependencies
- Run `postinstall` script (generates Prisma Client)
- Build your Next.js app
- Deploy to production

### 6. Set Up Database Schema

After deployment, you need to run migrations:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Push schema to database
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

**Option B: Using Vercel Dashboard**
1. Go to your project → Settings → Environment Variables
2. Copy the `DATABASE_URL` value
3. Run locally with the production database URL:
```bash
DATABASE_URL="your-production-url" npx prisma db push
DATABASE_URL="your-production-url" npx prisma db seed
```

## Important Notes

✅ **Build Scripts**: The project includes `postinstall` script to automatically generate Prisma Client during Vercel builds

✅ **Database**: The schema is configured for PostgreSQL (required for Vercel serverless environment)

✅ **Environment Variables**: All required variables are documented in the README

✅ **No Code Changes Needed**: The application code is already compatible with PostgreSQL

## Troubleshooting

### Build Fails with Prisma Errors
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check that Prisma Client is generated (happens automatically via `postinstall`)

### Database Connection Errors
- Verify `DATABASE_URL` is correctly set
- Ensure your PostgreSQL database is accessible
- Check database credentials

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your Vercel deployment URL
- Ensure `NEXTAUTH_SECRET` is set and not empty

## Next Steps After Deployment

1. ✅ Database schema is pushed
2. ✅ Seed initial data (users, sample data)
3. ✅ Test the application
4. ✅ Set up custom domain (optional)

Your CRM dashboard should now be live on Vercel! 🚀

