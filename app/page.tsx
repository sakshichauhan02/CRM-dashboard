import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Home() {
  try {
    // Validate environment variables
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is missing')
      // Still redirect to login, but auth won't work
    }

    const session = await getServerSession(authOptions)

    if (session) {
      redirect('/dashboard')
    } else {
      redirect('/auth/login')
    }
  } catch (error: any) {
    console.error('Error in root page:', error?.message || error)
    // If database/auth fails, redirect to login
    redirect('/auth/login')
  }
}

