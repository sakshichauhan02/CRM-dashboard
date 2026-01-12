import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const checks: {
    timestamp: string
    environment: string | undefined
    database: {
      url: string
      connected: boolean
      error?: string
    }
    auth: {
      secret: string
      url: string
    }
  } = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      url: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      connected: false,
    },
    auth: {
      secret: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      url: process.env.NEXTAUTH_URL ? `✅ ${process.env.NEXTAUTH_URL}` : '❌ Missing',
    },
  }

  // Test database connection
  try {
    const { prisma } = await import('@/lib/db')
    await prisma.$queryRaw`SELECT 1`
    checks.database.connected = true
  } catch (error: any) {
    checks.database.connected = false
    checks.database.error = error?.message || 'Connection failed'
  }

  const isHealthy = 
    checks.database.url === '✅ Set' &&
    checks.auth.secret === '✅ Set' &&
    checks.database.connected

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
  })
}

